# Circlue.ai Database ER Diagram

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string password_hash
        string name
        string role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    user_sessions {
        uuid id PK
        uuid user_id FK
        string token UK
        timestamp expires_at
        timestamp created_at
    }
    
    brands {
        uuid id PK
        uuid user_id FK
        string name
        text description
        string website
        text story
        string channels
        text marketing
        string social_channels
        string category
        string logo_url
        timestamp created_at
        timestamp updated_at
    }
    
    products {
        uuid id PK
        uuid brand_id FK
        string name
        text description
        string purchase_url
        string unit
        decimal price
        text ingredients
        text usage
        text effects
        text usp
        string target_gender
        string target_age
        string category
        string image_url
        timestamp created_at
        timestamp updated_at
    }
    
    influencers {
        uuid id PK
        string name
        string real_name
        string category
        string platform
        string region
        integer followers
        integer avg_views
        integer avg_likes
        integer avg_comments
        decimal engagement_rate
        string profile_image_url
        string instagram_url
        string youtube_url
        string xiaohongshu_url
        string tiktok_url
        string douyin_url
        string weibo_url
        string bilibili_url
        decimal base_fee
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    campaigns {
        uuid id PK
        uuid brand_id FK
        uuid product_id FK
        string title
        text description
        decimal budget
        date campaign_start_date
        date campaign_end_date
        date proposal_deadline
        string ad_type
        string status
        integer current_stage
        timestamp created_at
        timestamp updated_at
    }
    
    campaign_target_content {
        uuid id PK
        uuid campaign_id FK UK
        string influencer_categories
        string target_age
        integer usp_importance
        text influencer_impact
        text additional_description
        boolean secondary_content_usage
    }
    
    campaign_influencers {
        uuid id PK
        uuid campaign_id FK
        uuid influencer_id FK
        decimal proposed_fee
        decimal ad_fee
        string deliverables
        text additional_terms
        string status
        date production_start_date
        date production_deadline
        timestamp created_at
        timestamp updated_at
    }
    
    personas {
        uuid id PK
        uuid brand_id FK
        uuid product_id FK
        string name
        string age
        string gender
        string interests
        string occupation
        text lifestyle
        text shopping_habits
        timestamp created_at
        timestamp updated_at
    }
    
    content_plans {
        uuid id PK
        uuid campaign_id FK
        uuid influencer_id FK
        string content_type
        string status
        jsonb plan_data
        integer current_revision_number
        timestamp created_at
        timestamp updated_at
    }
    
    content_submissions {
        uuid id PK
        uuid campaign_id FK
        uuid influencer_id FK
        string content_type
        string status
        integer current_revision_number
        string published_url
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    content_files {
        uuid id PK
        uuid submission_id FK
        string file_url
        string file_type
        integer file_size
        string thumbnail_url
        integer duration
        timestamp created_at
    }
    
    content_revisions {
        uuid id PK
        uuid content_plan_id FK
        uuid submission_id FK
        integer revision_number
        text feedback
        uuid feedback_by FK
        string status
        jsonb revision_data
        timestamp created_at
    }
    
    performance_metrics {
        uuid id PK
        uuid campaign_id FK
        uuid influencer_id FK
        uuid content_submission_id FK
        string platform
        date metric_date
        integer views
        integer likes
        integer comments
        integer shares
        integer saves
        decimal engagement_rate
        decimal click_through_rate
        decimal conversion_rate
        decimal sales_amount
        timestamp created_at
        timestamp updated_at
    }
    
    comment_analysis {
        uuid id PK
        uuid performance_metric_id FK
        integer total_comments
        integer positive_comments
        integer negative_comments
        integer neutral_comments
        string key_topics
        decimal sentiment_score
        jsonb analysis_data
        timestamp analyzed_at
    }
    
    settlements {
        uuid id PK
        uuid campaign_id FK
        uuid brand_id FK
        decimal amount
        string status
        date due_date
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }
    
    tax_invoices {
        uuid id PK
        uuid settlement_id FK
        string invoice_number UK
        string business_number
        string company_name
        string ceo_name
        text address
        string business_type
        string business_item
        decimal amount
        decimal tax_amount
        decimal total_amount
        date issued_date
        string file_url
        timestamp created_at
    }
    
    payments {
        uuid id PK
        uuid settlement_id FK
        string payment_method
        string transaction_id
        decimal paid_amount
        timestamp paid_at
        string receipt_url
        timestamp created_at
    }
    
    audit_logs {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb old_values
        jsonb new_values
        string ip_address
        text user_agent
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid user_id FK
        string type
        string title
        text message
        jsonb data
        boolean is_read
        timestamp read_at
        timestamp created_at
    }
    
    users ||--o{ user_sessions : has
    users ||--o{ brands : owns
    users ||--o{ notifications : receives
    users ||--o{ audit_logs : performs
    users ||--o{ content_revisions : gives_feedback
    
    brands ||--o{ products : has
    brands ||--o{ campaigns : runs
    brands ||--o{ personas : creates
    brands ||--o{ settlements : has
    
    products ||--o{ campaigns : featured_in
    products ||--o{ personas : associated_with
    
    campaigns ||--|| campaign_target_content : has
    campaigns ||--o{ campaign_influencers : involves
    campaigns ||--o{ content_plans : contains
    campaigns ||--o{ content_submissions : contains
    campaigns ||--o{ performance_metrics : measured_by
    campaigns ||--o{ settlements : generates
    
    influencers ||--o{ campaign_influencers : participates_in
    influencers ||--o{ content_plans : creates
    influencers ||--o{ content_submissions : submits
    influencers ||--o{ performance_metrics : tracked_by
    
    content_submissions ||--o{ content_files : contains
    content_submissions ||--o{ content_revisions : has
    content_submissions ||--o{ performance_metrics : measured_by
    
    content_plans ||--o{ content_revisions : has
    
    performance_metrics ||--o{ comment_analysis : analyzed_by
    
    settlements ||--o{ tax_invoices : has
    settlements ||--o{ payments : has
```

## 테이블 관계 설명

### 사용자 중심 관계
- **users** → **brands**: 사용자는 여러 브랜드를 소유할 수 있음
- **users** → **user_sessions**: 사용자는 여러 세션을 가질 수 있음
- **users** → **notifications**: 사용자는 여러 알림을 받을 수 있음

### 브랜드 중심 관계
- **brands** → **products**: 브랜드는 여러 제품을 가질 수 있음
- **brands** → **campaigns**: 브랜드는 여러 캠페인을 운영할 수 있음
- **brands** → **personas**: 브랜드는 여러 페르소나를 생성할 수 있음

### 캠페인 중심 관계
- **campaigns** ↔ **influencers**: 다대다 관계 (campaign_influencers 테이블로 연결)
- **campaigns** → **content_plans**: 캠페인은 여러 콘텐츠 기획을 포함
- **campaigns** → **content_submissions**: 캠페인은 여러 콘텐츠 제출을 포함
- **campaigns** → **performance_metrics**: 캠페인의 성과는 여러 메트릭으로 측정

### 콘텐츠 중심 관계
- **content_submissions** → **content_files**: 제출된 콘텐츠는 여러 파일을 포함
- **content_plans/submissions** → **content_revisions**: 콘텐츠는 여러 수정 이력을 가짐

### 정산 중심 관계
- **settlements** → **tax_invoices**: 정산은 세금계산서를 가질 수 있음
- **settlements** → **payments**: 정산은 결제 정보를 가질 수 있음