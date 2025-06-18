
interface SystemSettings {
  siteName: string;
  adminEmail: string;
  maintenanceMode: boolean;
}

interface PlatformSettings {
  xiaohongshu: {
    enabled: boolean;
    displayName: string;
    displayNameChinese: string;
    icon: string;
    color: string;
    bgColor: string;
    domains: string[];
    urlPatterns: string[];
    metrics: string[];
    crawlingInterval: number;
  };
  douyin: {
    enabled: boolean;
    displayName: string;
    displayNameChinese: string;
    icon: string;
    color: string;
    bgColor: string;
    domains: string[];
    urlPatterns: string[];
    metrics: string[];
    crawlingInterval: number;
  };
}

interface UserManagementSettings {
  twoFactorRequired: boolean;
  loginAttemptLimit: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

interface ContentPolicySettings {
  autoApproval: boolean;
  requireBrandVerification: boolean;
  prohibitedKeywords: string[];
  minimumCampaignBudget: number;
}

interface SettlementSettings {
  platformFeeRate: number;
  settlementCycle: string;
  minimumSettlementAmount: number;
}

interface NotificationSettings {
  newCampaignNotification: boolean;
  settlementNotification: boolean;
  emailTemplates: {
    [key: string]: string;
  };
}

export interface AdminSettings {
  system: SystemSettings;
  platforms: PlatformSettings;
  users: UserManagementSettings;
  content: ContentPolicySettings;
  settlement: SettlementSettings;
  notifications: NotificationSettings;
}

class SettingsService {
  private storageKey = 'admin_settings';
  private defaultSettings: AdminSettings = {
    system: {
      siteName: 'Circlue',
      adminEmail: 'admin@circlue.ai',
      maintenanceMode: false,
    },
    platforms: {
      xiaohongshu: {
        enabled: true,
        displayName: '샤오홍슈',
        displayNameChinese: '小红书',
        icon: '📕',
        color: '#ff2442',
        bgColor: '#fff5f5',
        domains: ['xiaohongshu.com', 'xhslink.com'],
        urlPatterns: ['^https://(www\\.)?xiaohongshu\\.com/', '^https://xhslink\\.com/'],
        metrics: ['exposure', 'likes', 'collections', 'comments', 'shares'],
        crawlingInterval: 10,
      },
      douyin: {
        enabled: true,
        displayName: '도우인',
        displayNameChinese: '抖音',
        icon: '🎵',
        color: '#000000',
        bgColor: '#f5f5f5',
        domains: ['douyin.com', 'iesdouyin.com'],
        urlPatterns: ['^https://(www\\.)?douyin\\.com/', '^https://v\\.douyin\\.com/'],
        metrics: ['views', 'likes', 'comments', 'shares', 'follows'],
        crawlingInterval: 10,
      },
    },
    users: {
      twoFactorRequired: false,
      loginAttemptLimit: true,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
    },
    content: {
      autoApproval: false,
      requireBrandVerification: true,
      prohibitedKeywords: [],
      minimumCampaignBudget: 100000,
    },
    settlement: {
      platformFeeRate: 0.15,
      settlementCycle: 'monthly',
      minimumSettlementAmount: 50000,
    },
    notifications: {
      newCampaignNotification: true,
      settlementNotification: true,
      emailTemplates: {
        campaignApproval: '캠페인이 승인되었습니다.',
        settlementComplete: '정산이 완료되었습니다.',
      },
    },
  };

  // 안전한 localStorage 접근을 위한 헬퍼 메서드
  private safeGetItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn(`localStorage getItem failed for key "${key}":`, error);
      return null;
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`localStorage setItem failed for key "${key}":`, error);
      return false;
    }
  }

  private safeRemoveItem(key: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage removeItem failed for key "${key}":`, error);
      return false;
    }
  }

  private safeJsonParse(jsonString: string | null): any | null {
    if (!jsonString || jsonString === 'undefined' || jsonString === 'null') {
      return null;
    }
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('JSON parse failed:', error);
      return null;
    }
  }

  private safeJsonStringify(obj: any): string | null {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('JSON stringify failed:', error);
      return null;
    }
  }

  getSettings(): AdminSettings {
    console.log('⚙️ 설정 로드 시작');
    
    const stored = this.safeGetItem(this.storageKey);
    if (!stored) {
      console.log('📝 저장된 설정 없음, 기본값 사용');
      return this.defaultSettings;
    }

    const parsedSettings = this.safeJsonParse(stored);
    if (!parsedSettings || typeof parsedSettings !== 'object') {
      console.log('❌ 설정 파싱 실패, 기본값 사용');
      this.safeRemoveItem(this.storageKey);
      return this.defaultSettings;
    }

    const mergedSettings = this.deepMerge(this.defaultSettings, parsedSettings);
    console.log('✅ 설정 로드 완료');
    return mergedSettings;
  }

  updateSettings(settings: Partial<AdminSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = this.deepMerge(currentSettings, settings);
      
      const settingsString = this.safeJsonStringify(updatedSettings);
      if (!settingsString) {
        throw new Error('설정 직렬화 실패');
      }

      const success = this.safeSetItem(this.storageKey, settingsString);
      if (!success) {
        throw new Error('설정 저장 실패');
      }
      
      console.log('✅ 설정 업데이트 완료');
    } catch (error) {
      console.error('❌ 설정 업데이트 실패:', error);
      throw new Error('설정 저장에 실패했습니다.');
    }
  }

  private deepMerge(target: any, source: any): any {
    try {
      const result = { ...target };
      
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      
      return result;
    } catch (error) {
      console.warn('❌ deepMerge 실패, 기본값 반환:', error);
      return target;
    }
  }

  getPlatformSettings(): PlatformSettings {
    try {
      return this.getSettings().platforms;
    } catch (error) {
      console.warn('❌ 플랫폼 설정 로드 실패, 기본값 사용:', error);
      return this.defaultSettings.platforms;
    }
  }

  updatePlatformSettings(platformSettings: Partial<PlatformSettings>): void {
    try {
      const currentSettings = this.getSettings();
      this.updateSettings({
        platforms: { ...currentSettings.platforms, ...platformSettings }
      });
    } catch (error) {
      console.error('❌ 플랫폼 설정 업데이트 실패:', error);
    }
  }

  getCrawlingInterval(platform: string): number {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.crawlingInterval || 10;
    } catch (error) {
      console.warn('❌ 크롤링 간격 조회 실패, 기본값 사용:', error);
      return 10;
    }
  }

  isPlatformEnabled(platform: string): boolean {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.enabled || false;
    } catch (error) {
      console.warn('❌ 플랫폼 활성화 상태 조회 실패, 기본값 사용:', error);
      return false;
    }
  }

  getPlatformMetrics(platform: string): string[] {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.metrics || [];
    } catch (error) {
      console.warn('❌ 플랫폼 메트릭 조회 실패, 기본값 사용:', error);
      return [];
    }
  }
}

export const settingsService = new SettingsService();
