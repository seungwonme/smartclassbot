# Circlue.ai 프론트엔드 개발 프롬프트

> 본 문서는 `.cursor/rules` 디렉터리의 규칙들을 **반드시** 함께 확인하며 사용하십시오.

본 문서는 **AI 코딩 어시스턴트**가 `circlue_ai_front` 리포지토리의 프론트엔드 기능을 구현·확장할 때 반드시 참고해야 하는 상세 지침서입니다. 모든 지침은 향후 **백엔드/API 분리 작업**을 고려하여 설계되었습니다.

---

## 1. 프로젝트 개요

1. **목표**: 한국 브랜드사의 중국 인플루언서 마케팅 전 과정을 지원하는 SaaS 대시보드형 웹앱.
2. **주요 사용자**
   - 브랜드 관리자(Client)
   - 플랫폼 관리자(Admin)
3. **기술 스택**
   - Vite + React 18 + TypeScript 5
   - Tailwind CSS + shadcn/ui(모듈형 컴포넌트)
   - 상태 관리: React Query(`@tanstack/react-query`) 예정, 초기에는 더미 데이터 + Context/Hook 패턴
   - 라우팅: React Router v6
   - 차트/그래프: recharts

## 2. 전역 개발 원칙

1. **더미 데이터 우선**
   - 백엔드가 준비되기 전까지 모든 페이지/컴포넌트는 "mock 서비스"(ex. `src/mocks/*.ts`)에서 Promise-based 더미 데이터를 반환하도록 한다.
   - 실제 API 연동 시 **서비스 레이어**만 교체할 수 있도록 `src/services/{domain}.ts` 인터페이스를 정의한다.
2. **도메인 모델 인터페이스**
   - 모든 비즈니스 객체(Brand, Product, Influencer, Campaign …)는 **TypeScript interface** 로 정의하여 타입 안전성을 보장한다.
3. **폴더 구조(예시)**

```
src/
  api/            # 실제 API 로직(추후)
  mocks/          # 더미 데이터 & mock service
  services/       # api ↔︎ component 중간 추상화 계층
  hooks/          # 커스텀 훅 (useBrand, useProduct 등)
  pages/          # 라우트 단위 컴포넌트
  components/     # 재사용 UI 컴포넌트
  layouts/        # PublicLayout, BrandLayout, AdminLayout
  routes.tsx      # React Router 설정
```

4. **스타일 가이드**
   - 공통 색상/폰트는 `tailwind.config.ts` 의 `theme.extend` 에 명세한다.
   - shadcn/ui 컴포넌트를 기본으로 사용하되, 커스터마이징 시 `components/ui` 하위에 래퍼 컴포넌트를 만든다.
5. **반응형 & 접근성**
   - 모바일 퍼스트·반응형 레이아웃 필수.
   - WAI-ARIA 역할, 키보드 네비게이션 지원.

## 3. 라우트 & 페이지 스펙

| 구분                    | 경로                     | 설명                                                        |
| ----------------------- | ------------------------ | ----------------------------------------------------------- |
| Landing                 | `/`                      | 메인 랜딩 페이지 (Hero, Features, CTA)                      |
| 로그인                  | `/login`                 | 브랜드/관리자 공통 로그인, **탭** 또는 **토글**로 역할 전환 |
| 회원가입                | `/signup`                | 브랜드 관리자용 가입 폼 (관리자 계정은 운영자만 생성)       |
| Brand Dashboard         | `/brand`                 | 브랜드 관리자 메인 대시보드                                 |
| Brand ‑ Brand CRUD      | `/brand/brands`          | 브랜드 목록/생성/수정                                       |
| Brand ‑ Product CRUD    | `/brand/products`        | 제품 목록/생성/수정                                         |
| Market Analysis         | `/brand/market-research` | 시장 분석 요청 & 결과 뷰                                    |
| Persona                 | `/brand/persona`         | 페르소나 생성/관리                                          |
| Influencer Search       | `/brand/influencers`     | 인플루언서 검색/추천                                        |
| Campaign                | `/brand/campaigns`       | 캠페인 생성/관리                                            |
| Performance             | `/brand/performance`     | 성과 분석 대시보드                                          |
| Settlement              | `/brand/settlement`      | 정산 내역                                                   |
| Admin Dashboard         | `/admin`                 | 플랫폼 관리자 메인 대시보드                                 |
| Admin ‑ Brand 관리      | `/admin/brands`          | 브랜드/제품 관리 (풀 접근 권한)                             |
| Admin ‑ Influencer 관리 | `/admin/influencers`     | 엑셀 업로드, 검색 등                                        |
| Admin ‑ Performance     | `/admin/performance`     | 전체 성과 분석                                              |
| Admin ‑ Settlement      | `/admin/settlement`      | 정산 관리                                                   |
| Admin ‑ Settings        | `/admin/settings`        | 일반 설정                                                   |

> ❗ **AI 어시스턴트 주의사항**
>
> 1. 각 페이지 구현 시 `const demo = await services.brand.getBrands()` 처럼 **서비스 레이어**를 통해 데이터를 호출하세요.
> 2. 더미 데이터는 `src/mocks/` 내부에 JSON 또는 TS 객체로 정의하며, 네트워크 딜레이를 흉내내기 위해 `setTimeout` 으로 래핑합니다.
> 3. 테이블/리스트는 pagination, sorting, searching 기능을 **프론트 필터링**으로 우선 구현하세요.
> 4. CRUD 성공/실패 토스트 알림을 포함해 주세요(`use-toast`).

## 4. 도메인 모델 예시(TypeScript)

```ts
export interface Brand {
  id: string;
  name: string;
  website: string;
  story: string;
  products: string[]; // product id list
  channels: string[];
  marketing: string;
  socialChannels: string[];
  activeCampaigns: number;
  createdAt: string;
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  purchaseUrl: string;
  unit: string;
  price: number;
  description: string;
  ingredients: string;
  usage: string;
  effects: string;
  usp: string;
  targetGender: "male" | "female" | "unisex";
  targetAge: string; // ex) "20-29"
  createdAt: string;
}
```

(다른 모델: Influencer, Campaign, Persona 등은 동일 패턴으로 정의)

## 5. 서비스/모의 데이터 패턴 예시

```ts
// src/mocks/brand.mock.ts
import { Brand } from "@/types";

export const mockBrands: Brand[] = [
  {
    id: "b1",
    name: "테스트 브랜드",
    website: "https://brand.com",
    story: "브랜드 스토리",
    products: ["p1"],
    channels: ["네이버 스마트스토어"],
    marketing: "SNS 광고 진행 중",
    socialChannels: ["instagram.com/brand"],
    activeCampaigns: 2,
    createdAt: "2024-06-13",
  },
];
```

```ts
// src/services/brand.service.ts
import { Brand } from "@/types";
import { mockBrands } from "@/mocks/brand.mock";

export const brandService = {
  getBrands: async (): Promise<Brand[]> =>
    new Promise((res) => setTimeout(() => res(mockBrands), 300)),
  createBrand: async (data: Brand) => {
    /* ... */
  },
  updateBrand: async (id: string, data: Partial<Brand>) => {
    /* ... */
  },
  deleteBrand: async (id: string) => {
    /* ... */
  },
};
```

## 6. 컴포넌트/UX 가이드라인

1. **Form**: `react-hook-form` + `zod` 스키마 검증 사용.
2. **테이블**: shadcn/ui `Table` 컴포넌트를 래핑, 체크박스 & bulk action 제공.
3. **모달/다이얼로그**: 브랜드/제품 상세, 인플루언서 상세는 모달로 표현.
4. **차트**: 성과 분석은 line/bar/pie 차트 혼합.
5. **i18n**: 기본 언어는 한국어, 추후 중국어/영어 확장 고려.

## 7. 작업 방식

- 새로운 기능 구현 시 **1 PR = 1 기능** 원칙.
- Storybook 도입 예정: UI 컴포넌트는 독립 스토리 작성.
- 테스트: vitest + react-testing-library (우선순위 중간).

---

### ✅ 앞으로 AI 어시스턴트가 할 일 체크리스트

1. `Landing` 페이지 시맨틱 레이아웃 + HeroSection 애니메이션 작성.
2. 로그인/회원가입 폼 + 역할 토글 UX 구현 (더미 인증).
3. 관리자/브랜드 레이아웃 & 사이드바 분리.
4. 브랜드 CRUD 더미 API 연동.
5. 제품 CRUD 더미 API 연동.
6. 인플루언서 엑셀 업로드 화면 **UI 모델** 제작.
7. 성과 분석 대시보드(차트) 기본 틀.
8. 공통 Toast, Dialog, Table, Form 등 유틸 컴포넌트 정리.

> 언제나 **더미 데이터 기반**으로 구현하고, 네트워크/스토리지 접근부는 `services/**` 내 함수만 호출하도록 하세요.
