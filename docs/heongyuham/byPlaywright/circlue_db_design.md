# Circlue.ai 데이터베이스 설계

## 개요
Circlue.ai는 한국 브랜드와 중국 인플루언서를 연결하는 AI 기반 마케팅 플랫폼입니다. 
이 문서는 시스템의 핵심 기능을 지원하기 위한 데이터베이스 스키마를 정의합니다.

## 주요 엔티티

### 1. 사용자 관리

#### users
사용자 계정 정보를 저장하는 기본 테이블
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### user_profiles
사용자 상세 프로필 정보
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    position VARCHAR(50),
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 브랜드 관리

#### brands
브랜드 기본 정보
```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    story TEXT,
    marketing_description TEXT,
    logo_url VARCHAR(500),
    active_campaigns INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### brand_channels
브랜드 판매 채널
```sql
CREATE TABLE brand_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    channel_type VARCHAR(50) NOT NULL, -- '네이버 스마트스토어', '쿠팡', '마켓컬리' 등
    channel_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### brand_social_channels
브랜드 소셜 미디어 채널
```sql
CREATE TABLE brand_social_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'youtube', 'tiktok' 등
    channel_url VARCHAR(500),
    follower_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 제품 관리

#### products
제품 정보
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    purchase_url VARCHAR(500),
    unit VARCHAR(50), -- '개', 'ml', 'g' 등
    price DECIMAL(10, 2),
    description TEXT,
    ingredients TEXT,
    usage_instructions TEXT,
    effects TEXT,
    usp TEXT, -- Unique Selling Point
    target_gender VARCHAR(10) CHECK (target_gender IN ('male', 'female', 'unisex')),
    target_age_start INTEGER,
    target_age_end INTEGER,
    image_urls TEXT[], -- PostgreSQL 배열 타입
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 인플루언서 관리

#### influencers
인플루언서 기본 정보
```sql
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname VARCHAR(100) NOT NULL,
    real_name VARCHAR(100),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('douyin', 'xiaohongshu')),
    platform_user_id VARCHAR(100),
    profile_url VARCHAR(500),
    profile_image_url VARCHAR(500),
    follower_count INTEGER,
    engagement_rate DECIMAL(5, 2), -- 퍼센트 (예: 4.2%)
    region VARCHAR(50), -- '베이징', '상하이' 등
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### influencer_categories
인플루언서 카테고리
```sql
CREATE TABLE influencer_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- '뷰티', '패션', '요리' 등
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### influencer_metrics
인플루언서 성과 지표
```sql
CREATE TABLE influencer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    follower_count INTEGER,
    engagement_rate DECIMAL(5, 2),
    avg_views INTEGER,
    avg_likes INTEGER,
    avg_comments INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(influencer_id, metric_date)
);
```

### 5. 캠페인 관리

#### campaigns
캠페인 기본 정보
```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    budget DECIMAL(12, 2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'creating' CHECK (status IN ('creating', 'confirming', 'content_planning', 'content_production', 'content_review', 'live', 'monitoring', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### campaign_products
캠페인에 포함된 제품
```sql
CREATE TABLE campaign_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### campaign_influencers
캠페인 참여 인플루언서
```sql
CREATE TABLE campaign_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id),
    status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'rejected', 'confirmed', 'completed')),
    fee DECIMAL(10, 2),
    contract_url VARCHAR(500),
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. 페르소나 관리

#### personas
AI 생성 페르소나
```sql
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age_group VARCHAR(20), -- '20-29', '30-39' 등
    gender VARCHAR(10),
    location VARCHAR(100),
    interests TEXT[],
    lifestyle TEXT,
    shopping_habits TEXT,
    pain_points TEXT,
    ai_generated_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. 콘텐츠 관리

#### contents
인플루언서가 제작한 콘텐츠
```sql
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_influencer_id UUID NOT NULL REFERENCES campaign_influencers(id) ON DELETE CASCADE,
    content_type VARCHAR(20) CHECK (content_type IN ('video', 'image', 'post', 'live')),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('douyin', 'xiaohongshu')),
    content_url VARCHAR(500),
    title VARCHAR(200),
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'revision_requested', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### content_metrics
콘텐츠 성과 지표
```sql
CREATE TABLE content_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_id, metric_date)
);
```

### 8. 분석 및 리포트

#### campaign_analytics
캠페인 분석 데이터
```sql
CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    analytics_date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL(5, 2),
    roi DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, analytics_date)
);
```

### 9. 정산 관리

#### billings
정산 정보
```sql
CREATE TABLE billings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    billing_type VARCHAR(20) CHECK (billing_type IN ('platform_fee', 'influencer_fee', 'other')),
    amount DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    due_date DATE,
    paid_date DATE,
    invoice_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. 시스템 관리

#### system_logs
시스템 활동 로그
```sql
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### platform_settings
플랫폼 설정
```sql
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 인덱스

성능 최적화를 위한 주요 인덱스:

```sql
-- 사용자 관련
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 브랜드 관련
CREATE INDEX idx_brands_created_by ON brands(created_by);
CREATE INDEX idx_brand_channels_brand_id ON brand_channels(brand_id);

-- 제품 관련
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_target ON products(target_gender, target_age_start, target_age_end);

-- 인플루언서 관련
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_region ON influencers(region);
CREATE INDEX idx_influencer_categories_category ON influencer_categories(category);

-- 캠페인 관련
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);

-- 콘텐츠 관련
CREATE INDEX idx_contents_campaign_influencer_id ON contents(campaign_influencer_id);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_content_metrics_content_id ON content_metrics(content_id);

-- 분석 관련
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON campaign_analytics(analytics_date);
```

## 트리거

자동 업데이트를 위한 트리거:

```sql
-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
-- 이하 모든 updated_at 컬럼이 있는 테이블에 동일하게 적용
```

## 보안 고려사항

1. **Row Level Security (RLS)**: 브랜드 사용자는 자신의 브랜드 데이터만 접근 가능
2. **암호화**: 민감한 정보(계약서 URL, 개인정보 등)는 암호화하여 저장
3. **감사 로그**: 모든 중요한 데이터 변경사항은 system_logs에 기록
4. **백업**: 일일 자동 백업 및 월간 장기 보관

## 확장성 고려사항

1. **파티셔닝**: content_metrics, campaign_analytics 등 시계열 데이터는 날짜별 파티셔닝
2. **샤딩**: 인플루언서 데이터는 플랫폼별로 샤딩 가능
3. **캐싱**: Redis를 활용한 자주 조회되는 데이터 캐싱
4. **읽기 전용 복제본**: 분석 쿼리는 읽기 전용 DB에서 실행

## 마이그레이션 전략

1. 버전 관리: Flyway 또는 Liquibase 사용
2. 롤백 계획: 각 마이그레이션에 대한 롤백 스크립트 준비
3. 무중단 배포: 블루-그린 배포 전략 적용