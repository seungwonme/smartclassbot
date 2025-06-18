
interface BrandCompanySettings {
  companyName: string;
  businessNumber: string;
  address: string;
  ceoName: string;
  industry: string;
}

interface BrandContactSettings {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  department: string;
  position: string;
}

interface BrandBillingSettings {
  billingEmail: string;
  paymentMethod: string;
  taxInvoiceInfo?: string;
}

interface BrandNotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  campaignUpdates: boolean;
  settlementAlerts: boolean;
}

interface BrandSecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiryDays: number;
}

interface BrandLanguageSettings {
  language: 'ko' | 'en' | 'zh';
  timezone: string;
  currency: 'KRW' | 'USD' | 'CNY';
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
}

interface BrandDataSettings {
  autoBackup: boolean;
  dataRetentionDays: number;
  exportFormat: 'CSV' | 'Excel' | 'JSON';
}

export interface BrandSettings {
  company: BrandCompanySettings;
  contact: BrandContactSettings;
  billing: BrandBillingSettings;
  notifications: BrandNotificationSettings;
  security: BrandSecuritySettings;
  language: BrandLanguageSettings;
  data: BrandDataSettings;
}

class BrandSettingsService {
  private storageKey = 'brand_settings';
  private defaultSettings: BrandSettings = {
    company: {
      companyName: '',
      businessNumber: '',
      address: '',
      ceoName: '',
      industry: '',
    },
    contact: {
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      department: '',
      position: '',
    },
    billing: {
      billingEmail: '',
      paymentMethod: '',
      taxInvoiceInfo: '',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      campaignUpdates: true,
      settlementAlerts: true,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 60,
      passwordExpiryDays: 90,
    },
    language: {
      language: 'ko',
      timezone: 'Asia/Seoul',
      currency: 'KRW',
      dateFormat: 'YYYY-MM-DD',
    },
    data: {
      autoBackup: true,
      dataRetentionDays: 365,
      exportFormat: 'Excel',
    },
  };

  getBrandSettings(): BrandSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        return this.deepMerge(this.defaultSettings, parsedSettings);
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('브랜드 설정 로드 실패:', error);
      return this.defaultSettings;
    }
  }

  updateBrandSettings(settings: Partial<BrandSettings>): void {
    try {
      const currentSettings = this.getBrandSettings();
      const updatedSettings = this.deepMerge(currentSettings, settings);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      
      console.log('=== 브랜드 설정 업데이트 ===');
      console.log('업데이트된 설정:', settings);
    } catch (error) {
      console.error('브랜드 설정 저장 실패:', error);
      throw new Error('브랜드 설정 저장에 실패했습니다.');
    }
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // 기존 서비스들에서 안전하게 호출할 수 있는 헬퍼 메서드들
  getCompanyInfo(): BrandCompanySettings {
    return this.getBrandSettings().company;
  }

  getContactInfo(): BrandContactSettings {
    return this.getBrandSettings().contact;
  }

  getBillingInfo(): BrandBillingSettings {
    return this.getBrandSettings().billing;
  }

  getNotificationPreferences(): BrandNotificationSettings {
    return this.getBrandSettings().notifications;
  }

  getSecuritySettings(): BrandSecuritySettings {
    return this.getBrandSettings().security;
  }

  getLanguageSettings(): BrandLanguageSettings {
    return this.getBrandSettings().language;
  }

  getDataSettings(): BrandDataSettings {
    return this.getBrandSettings().data;
  }

  // 특정 설정값이 존재하는지 확인하는 안전한 메서드
  hasCompanyInfo(): boolean {
    const company = this.getCompanyInfo();
    return !!(company.companyName && company.businessNumber);
  }

  hasBillingInfo(): boolean {
    const billing = this.getBillingInfo();
    return !!(billing.billingEmail && billing.paymentMethod);
  }

  // 기존 서비스들이 설정값을 옵셔널로 활용할 수 있는 메서드들
  getFormattedCurrency(amount: number): string {
    const settings = this.getLanguageSettings();
    switch (settings.currency) {
      case 'USD':
        return `$${amount.toLocaleString()}`;
      case 'CNY':
        return `¥${amount.toLocaleString()}`;
      case 'KRW':
      default:
        return `₩${amount.toLocaleString()}`;
    }
  }

  getFormattedDate(date: Date): string {
    const settings = this.getLanguageSettings();
    switch (settings.dateFormat) {
      case 'MM/DD/YYYY':
        return date.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return date.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
      default:
        return date.toISOString().split('T')[0];
    }
  }

  shouldSendNotification(type: keyof BrandNotificationSettings): boolean {
    const notifications = this.getNotificationPreferences();
    return notifications[type] || false;
  }
}

export const brandSettingsService = new BrandSettingsService();
