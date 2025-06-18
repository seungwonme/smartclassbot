# Circlue.ai 데이터베이스 스키마 설계

## 1. 수집된 데이터 분석

웹사이트 탐색을 통해 확인된 주요 엔티티와 필드:

### 1.1 사용자 관련
- **User**: 이메일, 비밀번호, 역할(brand/admin), 이름, 성
- **Company**: 회사명, 사업자등록번호, 주소, 대표자명, 업종
- **Contact**: 담당자명, 이메일, 전화번호, 부서, 직책

### 1.2 브랜드/제품 관련
- **Brand**: 브랜드명, 웹사이트, 스토리, 판매채널[], 소셜채널[], 마케팅정보, 활성캠페인수
- **Product**: 제품명, 브랜드ID, 판매URL, 단가, 용량/사이즈, 설명, 성분, 사용법, 효과, USP, 타겟성별, 타겟연령대

### 1.3 인플루언서 관련
- **Influencer**: 닉네임, 프로필이미지, 플랫폼(도우인/샤오홍슈), 팔로워수, 참여율, 지역, 카테고리[], URL
- **InfluencerMetrics**: 인플루언서ID, 총콘텐츠수, 평균조회수, 평균좋아요수, 평균댓글수

### 1.4 캠페인 관련
- **Campaign**: 캠페인명, 브랜드ID, 예산, 시작일, 종료일, 상태(생성중/확정/콘텐츠제작/라이브/완료), 인플루언서수
- **CampaignInfluencer**: 캠페인ID, 인플루언서ID, 참여상태, 계약금액

### 1.5 페르소나 관련
- **MarketResearch**: 브랜드ID, 제품ID, 리서치데이터, 생성일
- **Persona**: 브랜드ID, 제품ID, 페르소나데이터, 생성일

### 1.6 성과/분석 관련
- **Performance**: 캠페인ID, 날짜, 플랫폼, 노출수, 조회수, 좋아요수, 댓글수, 공유수
- **Sentiment**: 캠페인ID, 긍정비율, 부정비율, 중립비율, 분석일

### 1.7 정산 관련
- **Settlement**: 캠페인ID, 인플루언서ID, 정산금액, 상태(대기/처리중/완료), 세금계산서여부, 정산일

## 2. 초기 단일 테이블 구조 (스프레드시트 형태)

```
| user_id | user_email | user_role | company_name | brand_name | product_name | campaign_name | influencer_nickname | platform | followers | engagement_rate | campaign_status | budget | settlement_amount | settlement_status |
|---------|------------|-----------|--------------|------------|--------------|---------------|---------------------|----------|-----------|-----------------|-----------------|--------|-------------------|-------------------|
| 1       | admin@test | admin     | Circlue      | -          | -            | -             | -                   | -        | -         | -               | -               | -      | -                 | -                 |
| 2       | brand@test | brand     | 샘플회사A    | 샘플브랜드A | 프리미엄립스틱 | 신제품런칭캠페인 | 뷰티마스터          | 도우인   | 1500000   | 4.2             | 생성중          | 5000000| -                 | -                 |
| 2       | brand@test | brand     | 샘플회사A    | 샘플브랜드A | 프리미엄립스틱 | 신제품런칭캠페인 | 패션스타일러        | 샤오홍슈 | 1200000   | 5.1             | 생성중          | 5000000| -                 | -                 |
```

## 3. 정규화된 관계형 데이터베이스 스키마

### 3.1 Users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 Companies 테이블
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  business_number VARCHAR(50),
  address TEXT,
  ceo_name VARCHAR(100),
  business_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 User_Companies 테이블 (연결 테이블)
```sql
CREATE TABLE user_companies (
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  department VARCHAR(100),
  position VARCHAR(100),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (user_id, company_id)
);
```

### 3.4 Brands 테이블
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  story TEXT,
  sales_channels TEXT[], -- PostgreSQL 배열 타입
  social_channels TEXT[],
  marketing_info TEXT,
  active_campaigns INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5 Products 테이블
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  name VARCHAR(255) NOT NULL,
  purchase_url VARCHAR(500),
  unit VARCHAR(50),
  price DECIMAL(10, 2),
  description TEXT,
  ingredients TEXT,
  usage_instructions TEXT,
  effects TEXT,
  usp TEXT, -- Unique Selling Proposition
  target_gender VARCHAR(20) CHECK (target_gender IN ('male', 'female', 'unisex')),
  target_age_range VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.6 Influencers 테이블
```sql
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(255) NOT NULL,
  profile_image_url VARCHAR(500),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('douyin', 'xiaohongshu')),
  platform_url VARCHAR(500),
  follower_count INTEGER,
  engagement_rate DECIMAL(5, 2),
  region VARCHAR(100),
  categories TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(nickname, platform)
);
```

### 3.7 Campaigns 테이블
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  name VARCHAR(255) NOT NULL,
  budget DECIMAL(12, 2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('creating', 'confirmed', 'content_production', 'live', 'completed')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.8 Campaign_Influencers 테이블
```sql
CREATE TABLE campaign_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencers(id),
  participation_status VARCHAR(50) CHECK (participation_status IN ('invited', 'accepted', 'rejected', 'contracted')),
  contract_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, influencer_id)
);
```

### 3.9 Market_Research 테이블
```sql
CREATE TABLE market_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  product_id UUID REFERENCES products(id),
  research_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.10 Personas 테이블
```sql
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  product_id UUID REFERENCES products(id),
  persona_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.11 Campaign_Performance 테이블
```sql
CREATE TABLE campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  date DATE NOT NULL,
  platform VARCHAR(50),
  impressions INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, date, platform)
);
```

### 3.12 Sentiment_Analysis 테이블
```sql
CREATE TABLE sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  positive_rate DECIMAL(5, 2),
  negative_rate DECIMAL(5, 2),
  neutral_rate DECIMAL(5, 2),
  analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.13 Settlements 테이블
```sql
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencers(id),
  amount DECIMAL(10, 2),
  status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed')),
  tax_invoice_issued BOOLEAN DEFAULT false,
  settlement_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.14 System_Logs 테이블 (관리자 활동 로그)
```sql
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. 인덱스 설계

```sql
-- 자주 조회되는 외래 키
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX idx_campaign_performance_campaign_id ON campaign_performance(campaign_id);
CREATE INDEX idx_settlements_campaign_id ON settlements(campaign_id);

-- 검색용 인덱스
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_follower_count ON influencers(follower_count);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_settlements_status ON settlements(status);

-- 날짜 범위 검색용
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaign_performance_date ON campaign_performance(date);
```

## 5. 뷰(View) 설계

```sql
-- 브랜드 대시보드용 뷰
CREATE VIEW brand_dashboard_summary AS
SELECT 
  b.id as brand_id,
  b.name as brand_name,
  COUNT(DISTINCT c.id) as total_campaigns,
  COUNT(DISTINCT CASE WHEN c.status = 'live' THEN c.id END) as active_campaigns,
  COUNT(DISTINCT ci.influencer_id) as total_influencers,
  SUM(c.budget) as total_budget
FROM brands b
LEFT JOIN campaigns c ON b.id = c.brand_id
LEFT JOIN campaign_influencers ci ON c.id = ci.campaign_id
GROUP BY b.id, b.name;

-- 관리자 대시보드용 뷰
CREATE VIEW admin_dashboard_summary AS
SELECT 
  COUNT(DISTINCT b.id) as total_brands,
  COUNT(DISTINCT c.id) as total_campaigns,
  COUNT(DISTINCT i.id) as total_influencers,
  SUM(s.amount) as total_revenue
FROM brands b
CROSS JOIN campaigns c
CROSS JOIN influencers i
CROSS JOIN settlements s
WHERE s.status = 'completed';
```

## 6. 트리거 설계

```sql
-- updated_at 자동 업데이트 트리거
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
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... 다른 테이블들도 동일하게 적용
```

이 스키마는 Circlue.ai 플랫폼의 모든 핵심 기능을 지원하며, 확장 가능하고 정규화된 구조를 가지고 있습니다.