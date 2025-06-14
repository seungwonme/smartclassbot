
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
    status: "pending"
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
    status: "pending"
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
    status: "pending"
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
    status: "creating",
    currentStage: 1,
    targetContent: {
      influencerCategories: ["뷰티", "라이프스타일"],
      targetAge: "20-35",
      uspImportance: 8,
      influencerImpact: "마이크로 인플루언서",
      additionalDescription: "자연스러운 일상 콘텐츠 선호",
      secondaryContentUsage: true
    },
    influencers: [],
    createdAt: "2024-06-13",
    updatedAt: "2024-06-13"
  }
];
