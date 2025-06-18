
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

  getSettings(): AdminSettings {
    try {
      // Safely access localStorage
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available, using default settings');
        return this.defaultSettings;
      }

      const stored = window.localStorage.getItem(this.storageKey);
      
      if (!stored || stored === null || stored === 'undefined' || stored === '') {
        console.log('No stored settings found, using defaults');
        return this.defaultSettings;
      }

      // Safely parse JSON
      let parsedSettings;
      try {
        parsedSettings = JSON.parse(stored);
      } catch (parseError) {
        console.error('JSON parse error for settings:', parseError);
        console.log('Clearing corrupted settings and using defaults');
        this.clearCorruptedSettings();
        return this.defaultSettings;
      }

      if (!parsedSettings || typeof parsedSettings !== 'object') {
        console.warn('Invalid settings format, using defaults');
        return this.defaultSettings;
      }

      return this.deepMerge(this.defaultSettings, parsedSettings);
    } catch (error) {
      console.error('Critical error in getSettings:', error);
      return this.defaultSettings;
    }
  }

  private clearCorruptedSettings(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.error('Failed to clear corrupted settings:', error);
    }
  }

  updateSettings(settings: Partial<AdminSettings>): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available, cannot save settings');
        return;
      }

      const currentSettings = this.getSettings();
      const updatedSettings = this.deepMerge(currentSettings, settings);
      
      const settingsString = JSON.stringify(updatedSettings);
      window.localStorage.setItem(this.storageKey, settingsString);
      
      console.log('=== 관리자 설정 업데이트 ===');
      console.log('업데이트된 설정:', settings);
    } catch (error) {
      console.error('설정 저장 실패:', error);
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
      console.error('Deep merge error:', error);
      return target;
    }
  }

  getPlatformSettings(): PlatformSettings {
    try {
      return this.getSettings().platforms;
    } catch (error) {
      console.error('Error getting platform settings:', error);
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
      console.error('Error updating platform settings:', error);
    }
  }

  getCrawlingInterval(platform: string): number {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.crawlingInterval || 10;
    } catch (error) {
      console.error('Error getting crawling interval:', error);
      return 10;
    }
  }

  isPlatformEnabled(platform: string): boolean {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.enabled || false;
    } catch (error) {
      console.error('Error checking platform enabled:', error);
      return false;
    }
  }

  getPlatformMetrics(platform: string): string[] {
    try {
      const settings = this.getPlatformSettings();
      return settings[platform as keyof PlatformSettings]?.metrics || [];
    } catch (error) {
      console.error('Error getting platform metrics:', error);
      return [];
    }
  }
}

export const settingsService = new SettingsService();
