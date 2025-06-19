
-- Users 테이블 (사용자 계정)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies 테이블 (회사 정보)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  business_number VARCHAR(50),
  address TEXT,
  ceo_name VARCHAR(100),
  business_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User_Companies 연결 테이블
CREATE TABLE public.user_companies (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  department VARCHAR(100),
  position VARCHAR(100),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (user_id, company_id)
);

-- Brands 테이블 (브랜드 정보)
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  story TEXT,
  sales_channels TEXT[],
  social_channels TEXT[],
  marketing_info TEXT,
  active_campaigns INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products 테이블 (제품 정보)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  purchase_url VARCHAR(500),
  unit VARCHAR(50),
  price DECIMAL(10, 2),
  description TEXT,
  ingredients TEXT,
  usage_instructions TEXT,
  effects TEXT,
  usp TEXT,
  target_gender VARCHAR(20) CHECK (target_gender IN ('male', 'female', 'unisex')),
  target_age_range VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Influencers 테이블 (인플루언서 정보)
CREATE TABLE public.influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(500),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('douyin', 'xiaohongshu')),
  platform_url VARCHAR(500),
  follower_count INTEGER,
  engagement_rate DECIMAL(5, 2),
  region VARCHAR(100),
  categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(nickname, platform)
);

-- Campaigns 테이블 (캠페인 정보)
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  budget DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('creating', 'confirmed', 'content_production', 'live', 'completed')) DEFAULT 'creating',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign_Influencers 연결 테이블
CREATE TABLE public.campaign_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
  participation_status VARCHAR(50) CHECK (participation_status IN ('invited', 'accepted', 'rejected', 'contracted')) DEFAULT 'invited',
  contract_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, influencer_id)
);

-- Market_Research 테이블 (시장 조사)
CREATE TABLE public.market_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  research_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Personas 테이블 (페르소나)
CREATE TABLE public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  persona_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign_Performance 테이블 (캠페인 성과)
CREATE TABLE public.campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform VARCHAR(50),
  impressions INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, date, platform)
);

-- Sentiment_Analysis 테이블 (감성 분석)
CREATE TABLE public.sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  positive_rate DECIMAL(5, 2),
  negative_rate DECIMAL(5, 2),
  neutral_rate DECIMAL(5, 2),
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settlements 테이블 (정산)
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed')) DEFAULT 'pending',
  tax_invoice_issued BOOLEAN DEFAULT false,
  settlement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- Users 정책
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Companies 정책 (사용자가 속한 회사만 조회 가능)
CREATE POLICY "Users can view related companies" ON public.companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM public.user_companies
      WHERE user_id = auth.uid()
    )
  );

-- Brands 정책 (회사 소속 브랜드만 조회 가능)
CREATE POLICY "Users can view company brands" ON public.brands
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.user_companies
      WHERE user_id = auth.uid()
    )
  );

-- Products 정책
CREATE POLICY "Users can manage brand products" ON public.products
  FOR ALL USING (
    brand_id IN (
      SELECT b.id FROM public.brands b
      JOIN public.user_companies uc ON b.company_id = uc.company_id
      WHERE uc.user_id = auth.uid()
    )
  );

-- Campaigns 정책
CREATE POLICY "Users can manage brand campaigns" ON public.campaigns
  FOR ALL USING (
    brand_id IN (
      SELECT b.id FROM public.brands b
      JOIN public.user_companies uc ON b.company_id = uc.company_id
      WHERE uc.user_id = auth.uid()
    )
  );

-- Influencers 정책 (모든 인증된 사용자가 조회 가능)
CREATE POLICY "Authenticated users can view influencers" ON public.influencers
  FOR SELECT TO authenticated USING (true);

-- 관리자 정책 (admin 역할만 인플루언서 관리 가능)
CREATE POLICY "Admins can manage influencers" ON public.influencers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 기타 테이블들도 유사한 정책 적용
CREATE POLICY "Users can view related data" ON public.campaign_influencers
  FOR ALL USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      JOIN public.brands b ON c.brand_id = b.id
      JOIN public.user_companies uc ON b.company_id = uc.company_id
      WHERE uc.user_id = auth.uid()
    )
  );

-- 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'brand')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 등록 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 시간 자동 갱신 트리거들
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 성능 최적화를 위한 인덱스 생성
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON public.user_companies(company_id);
CREATE INDEX idx_brands_company_id ON public.brands(company_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_influencers_campaign_id ON public.campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON public.campaign_influencers(influencer_id);
CREATE INDEX idx_influencers_platform ON public.influencers(platform);
CREATE INDEX idx_influencers_follower_count ON public.influencers(follower_count);
CREATE INDEX idx_campaign_performance_campaign_id ON public.campaign_performance(campaign_id);
CREATE INDEX idx_campaign_performance_date ON public.campaign_performance(date);
CREATE INDEX idx_settlements_status ON public.settlements(status);
