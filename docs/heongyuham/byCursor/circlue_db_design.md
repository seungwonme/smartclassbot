# Circlue.ai 데이터베이스 설계

## 1. 개요

Circlue.ai는 한국 브랜드사의 중국 인플루언서 마케팅 전 과정을 지원하는 SaaS 플랫폼입니다. 본 문서는 시스템의 데이터베이스 설계를 정의합니다.

## 2. 데이터베이스 설계 원칙

- PostgreSQL 기반 설계
- UUID를 Primary Key로 사용
- 타임스탬프는 TIME ZONE 포함
- 배열 데이터타입 활용 (PostgreSQL 특성)
- JSONB 타입으로 유연한 데이터 저장
- 적절한 인덱스로 성능 최적화

## 3. 테이블 설계

### 3.1 사용자 및 인증 관련 테이블

```sql
-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 세션 테이블
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 브랜드 및 제품 관련 테이블

```sql
-- 브랜드 테이블
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    story TEXT,
    channels TEXT[], -- 판매 채널 배열
    marketing TEXT,
    social_channels TEXT[], -- SNS 채널 배열
    category VARCHAR(50),
    logo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 제품 테이블
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    purchase_url VARCHAR(255),
    unit VARCHAR(50),
    price DECIMAL(10, 2),
    ingredients TEXT,
    usage TEXT,
    effects TEXT,
    usp TEXT, -- Unique Selling Proposition
    target_gender VARCHAR(20) CHECK (target_gender IN ('male', 'female', 'unisex')),
    target_age VARCHAR(20), -- 예: "20-29"
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 인플루언서 관련 테이블

```sql
-- 인플루언서 마스터 테이블
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    real_name VARCHAR(100),
    category VARCHAR(50),
    platform VARCHAR(50) CHECK (platform IN ('douyin', 'xiaohongshu', 'weibo', 'bilibili')),
    region VARCHAR(50),
    followers INTEGER,
    avg_views INTEGER,
    avg_likes INTEGER,
    avg_comments INTEGER,
    engagement_rate DECIMAL(5, 2),
    profile_image_url VARCHAR(255),
    instagram_url VARCHAR(255),
    youtube_url VARCHAR(255),
    xiaohongshu_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    douyin_url VARCHAR(255),
    weibo_url VARCHAR(255),
    bilibili_url VARCHAR(255),
    base_fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 캠페인 관련 테이블

```sql
-- 캠페인 테이블
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    budget DECIMAL(10, 2) NOT NULL,
    campaign_start_date DATE NOT NULL,
    campaign_end_date DATE NOT NULL,
    proposal_deadline DATE NOT NULL,
    ad_type VARCHAR(50) CHECK (ad_type IN ('branding', 'live-commerce')),
    status VARCHAR(50) NOT NULL DEFAULT 'creating',
    current_stage INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 캠페인 타겟 콘텐츠 설정
CREATE TABLE campaign_target_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID UNIQUE NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_categories TEXT[],
    target_age VARCHAR(20),
    usp_importance INTEGER CHECK (usp_importance BETWEEN 1 AND 5),
    influencer_impact TEXT,
    additional_description TEXT,
    secondary_content_usage BOOLEAN DEFAULT false
);

-- 캠페인-인플루언서 연결 테이블
CREATE TABLE campaign_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    proposed_fee DECIMAL(10, 2),
    ad_fee DECIMAL(10, 2),
    deliverables TEXT[],
    additional_terms TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'invited',
    production_start_date DATE,
    production_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, influencer_id)
);
```

### 3.5 페르소나 관련 테이블

```sql
-- 페르소나 테이블
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    age VARCHAR(20),
    gender VARCHAR(20),
    interests TEXT[],
    occupation VARCHAR(100),
    lifestyle TEXT,
    shopping_habits TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.6 콘텐츠 관련 테이블

```sql
-- 콘텐츠 기획 테이블
CREATE TABLE content_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    content_type VARCHAR(20) CHECK (content_type IN ('image', 'video')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    plan_data JSONB NOT NULL, -- 이미지/비디오 기획 데이터
    current_revision_number INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 콘텐츠 제출 테이블
CREATE TABLE content_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    content_type VARCHAR(20) CHECK (content_type IN ('image', 'video')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    current_revision_number INTEGER DEFAULT 0,
    published_url VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 콘텐츠 파일 테이블
CREATE TABLE content_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES content_submissions(id) ON DELETE CASCADE,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    thumbnail_url VARCHAR(255),
    duration INTEGER, -- 비디오의 경우 초 단위
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 콘텐츠 수정 이력 테이블
CREATE TABLE content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_plan_id UUID REFERENCES content_plans(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES content_submissions(id) ON DELETE CASCADE,
    revision_number INTEGER NOT NULL,
    feedback TEXT,
    feedback_by UUID REFERENCES users(id),
    status VARCHAR(50),
    revision_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (content_plan_id IS NOT NULL AND submission_id IS NULL) OR 
        (content_plan_id IS NULL AND submission_id IS NOT NULL)
    )
);
```

### 3.7 성과 분석 관련 테이블

```sql
-- 성과 메트릭 테이블
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
    content_submission_id UUID REFERENCES content_submissions(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    metric_date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5, 2),
    click_through_rate DECIMAL(5, 2),
    conversion_rate DECIMAL(5, 2),
    sales_amount DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, influencer_id, platform, metric_date)
);

-- 댓글 분석 테이블
CREATE TABLE comment_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_metric_id UUID NOT NULL REFERENCES performance_metrics(id) ON DELETE CASCADE,
    total_comments INTEGER,
    positive_comments INTEGER,
    negative_comments INTEGER,
    neutral_comments INTEGER,
    key_topics TEXT[],
    sentiment_score DECIMAL(3, 2), -- -1.0 ~ 1.0
    analysis_data JSONB,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.8 정산 관련 테이블

```sql
-- 정산 테이블
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 세금계산서 테이블
CREATE TABLE tax_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id UUID NOT NULL REFERENCES settlements(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    business_number VARCHAR(50),
    company_name VARCHAR(100),
    ceo_name VARCHAR(50),
    address TEXT,
    business_type VARCHAR(50),
    business_item VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    issued_date DATE NOT NULL,
    file_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 결제 정보 테이블
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_id UUID NOT NULL REFERENCES settlements(id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    paid_amount DECIMAL(10, 2) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
    receipt_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.9 시스템 관련 테이블

```sql
-- 감사 로그 테이블
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 알림 테이블
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.10 인덱스 설정

```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_influencers_campaign_id ON campaign_influencers(campaign_id);
CREATE INDEX idx_campaign_influencers_influencer_id ON campaign_influencers(influencer_id);
CREATE INDEX idx_content_submissions_campaign_id ON content_submissions(campaign_id);
CREATE INDEX idx_performance_metrics_campaign_id ON performance_metrics(campaign_id);
CREATE INDEX idx_performance_metrics_date ON performance_metrics(metric_date);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 4. ER 다이어그램

```
사용자(users) ──┬── 브랜드(brands) ──┬── 제품(products)
               │                    │
               │                    └── 캠페인(campaigns) ──┬── 캠페인_인플루언서(campaign_influencers)
               │                                           │
               └── 알림(notifications)                      ├── 콘텐츠_기획(content_plans)
                                                          │
                                                          ├── 콘텐츠_제출(content_submissions)
                                                          │
                                                          └── 성과_메트릭(performance_metrics)

인플루언서(influencers) ──── 캠페인_인플루언서(campaign_influencers)

정산(settlements) ──┬── 세금계산서(tax_invoices)
                   │
                   └── 결제정보(payments)
```

## 5. 주요 비즈니스 규칙

### 5.1 사용자 역할
- `brand`: 브랜드 관리자 - 자신의 브랜드, 제품, 캠페인만 관리
- `admin`: 플랫폼 관리자 - 모든 데이터에 대한 전체 권한

### 5.2 캠페인 상태 워크플로우
1. `creating` - 캠페인 생성 중
2. `submitted` - 제출 완료
3. `recruiting` - 인플루언서 모집 중
4. `proposing` - 제안 진행 중
5. `revising` - 수정 중
6. `confirmed` - 확정
7. `planning` - 콘텐츠 기획 중
8. `producing` - 제작 중
9. `content-review` - 콘텐츠 검토 중
10. `live` - 라이브
11. `monitoring` - 모니터링 중
12. `completed` - 완료

### 5.3 데이터 무결성
- 브랜드가 삭제되면 관련 제품, 캠페인도 함께 삭제 (CASCADE)
- 캠페인과 인플루언서의 관계는 유니크 제약으로 중복 방지
- 성과 메트릭은 캠페인-인플루언서-플랫폼-날짜 조합으로 유니크

## 6. 확장 고려사항

### 6.1 다국어 지원
- 별도의 번역 테이블 추가 가능
- JSONB 필드를 활용한 다국어 데이터 저장

### 6.2 파일 스토리지
- 현재는 URL만 저장
- 추후 클라우드 스토리지 연동 시 메타데이터 테이블 추가

### 6.3 실시간 알림
- WebSocket 연동을 위한 알림 큐 테이블 추가 가능

### 6.4 분석 데이터 웨어하우스
- 대용량 분석 데이터는 별도 데이터베이스로 분리 고려

이 데이터베이스 설계는 Circlue.ai의 모든 핵심 기능을 지원하며, 확장성과 성능을 고려하여 설계되었습니다.