
import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";

export const mockInfluencers: CampaignInfluencer[] = [
  {
    id: "inf1",
    name: "뷰티 크리에이터 김소영",
    category: "뷰티",
    followers: 250000,
    avgViews: 180000,
    avgLikes: 7200,
    avgComments: 360,
    engagementRate: 4.2,
    profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    instagramUrl: "@beauty_soyoung",
    proposedFee: 800000,
    deliverables: ["인스타그램 포스트", "스토리"],
    status: "confirmed",
    productionStartDate: "2024-06-20",
    productionDeadline: "2024-06-30"
  },
  {
    id: "inf2",
    name: "패션 인플루언서 이민지",
    category: "패션",
    followers: 180000,
    avgViews: 120000,
    avgLikes: 4560,
    avgComments: 228,
    engagementRate: 3.8,
    profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    instagramUrl: "@fashion_minji",
    proposedFee: 600000,
    deliverables: ["인스타그램 포스트", "스토리"],
    status: "confirmed",
    productionStartDate: "2024-06-22",
    productionDeadline: "2024-07-02"
  },
  {
    id: "inf3",
    name: "라이프스타일 유튜버 박지혜",
    category: "라이프스타일",
    followers: 320000,
    avgViews: 250000,
    avgLikes: 12750,
    avgComments: 638,
    engagementRate: 5.1,
    profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    instagramUrl: "@lifestyle_jihye",
    youtubeUrl: "https://youtube.com/c/jihye",
    proposedFee: 1200000,
    deliverables: ["유튜브 영상", "인스타그램 포스트"],
    status: "confirmed",
    productionStartDate: "2024-06-18",
    productionDeadline: "2024-06-28"
  }
];

export const mockPersonas: Persona[] = [
  {
    id: "p1",
    name: "20대 직장인 여성",
    productId: "p1",
    age: "20-29",
    interests: ["뷰티", "패션", "커리어"]
  },
  {
    id: "p2",
    name: "30대 주부",
    productId: "p1",
    age: "30-39",
    interests: ["육아", "라이프스타일", "건강"]
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    title: "신제품 런칭 캠페인",
    brandId: "b1",
    brandName: "테스트 브랜드",
    productId: "p1",
    productName: "테스트 제품",
    budget: 5000000,
    proposalDeadline: "2024-07-15",
    campaignStartDate: "2024-07-20",
    campaignEndDate: "2024-08-20",
    adType: "branding",
    status: "producing",
    currentStage: 3,
    targetContent: {
      influencerCategories: ["뷰티", "라이프스타일"],
      targetAge: "20-35",
      uspImportance: 8,
      influencerImpact: "마이크로 인플루언서",
      additionalDescription: "자연스러운 일상 콘텐츠 선호",
      secondaryContentUsage: true
    },
    influencers: [
      {
        id: "inf1",
        name: "뷰티 크리에이터 김소영",
        category: "뷰티",
        followers: 250000,
        avgViews: 180000,
        avgLikes: 7200,
        avgComments: 360,
        engagementRate: 4.2,
        profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
        instagramUrl: "@beauty_soyoung",
        proposedFee: 800000,
        deliverables: ["인스타그램 포스트", "스토리"],
        status: "confirmed",
        productionStartDate: "2024-06-20",
        productionDeadline: "2024-06-30"
      },
      {
        id: "inf2",
        name: "패션 인플루언서 이민지",
        category: "패션",
        followers: 180000,
        avgViews: 120000,
        avgLikes: 4560,
        avgComments: 228,
        engagementRate: 3.8,
        profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
        instagramUrl: "@fashion_minji",
        proposedFee: 600000,
        deliverables: ["인스타그램 포스트", "스토리"],
        status: "confirmed",
        productionStartDate: "2024-06-22",
        productionDeadline: "2024-07-02"
      },
      {
        id: "inf3",
        name: "라이프스타일 유튜버 박지혜",
        category: "라이프스타일",
        followers: 320000,
        avgViews: 250000,
        avgLikes: 12750,
        avgComments: 638,
        engagementRate: 5.1,
        profileImageUrl: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
        instagramUrl: "@lifestyle_jihye",
        youtubeUrl: "https://youtube.com/c/jihye",
        proposedFee: 1200000,
        deliverables: ["유튜브 영상", "인스타그램 포스트"],
        status: "confirmed",
        productionStartDate: "2024-06-18",
        productionDeadline: "2024-06-28"
      }
    ],
    contentPlans: [
      {
        id: "cp1",
        influencerId: "inf1",
        influencerName: "뷰티 크리에이터 김소영",
        contentType: "image",
        status: "approved",
        planData: {
          concept: "자연스러운 일상 뷰티 루틴",
          hashtags: ["#뷰티", "#일상", "#뷰티루틴"],
          postingSchedule: "2024-06-25 오후 6시",
          description: "신제품을 활용한 자연스러운 데일리 메이크업 과정"
        },
        revisions: [],
        currentRevisionNumber: 0,
        createdAt: "2024-06-15T10:00:00Z",
        updatedAt: "2024-06-16T14:30:00Z"
      },
      {
        id: "cp2",
        influencerId: "inf2",
        influencerName: "패션 인플루언서 이민지",
        contentType: "image",
        status: "approved",
        planData: {
          concept: "패션 아이템과 함께하는 라이프스타일",
          hashtags: ["#패션", "#데일리룩", "#라이프스타일"],
          postingSchedule: "2024-06-27 오후 7시",
          description: "신제품을 자연스럽게 활용한 일상 스타일링"
        },
        revisions: [],
        currentRevisionNumber: 0,
        createdAt: "2024-06-15T11:00:00Z",
        updatedAt: "2024-06-16T15:00:00Z"
      },
      {
        id: "cp3",
        influencerId: "inf3",
        influencerName: "라이프스타일 유튜버 박지혜",
        contentType: "video",
        status: "approved",
        planData: {
          concept: "일상 브이로그 속 자연스러운 제품 소개",
          hashtags: ["#브이로그", "#일상", "#라이프스타일"],
          postingSchedule: "2024-06-26 오후 8시",
          description: "일상 루틴 중 자연스럽게 신제품을 소개하는 브이로그"
        },
        revisions: [],
        currentRevisionNumber: 0,
        createdAt: "2024-06-15T12:00:00Z",
        updatedAt: "2024-06-16T16:00:00Z"
      }
    ],
    createdAt: "2024-06-13",
    updatedAt: "2024-06-16"
  }
];
