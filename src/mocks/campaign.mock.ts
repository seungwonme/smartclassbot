import { Campaign, CampaignInfluencer, Persona } from "@/types/campaign";

export const mockInfluencers: CampaignInfluencer[] = [
  {
    id: "inf1",
    name: "뷰티 크리에이터 김소영",
    category: "뷰티",
    followers: 250000,
    engagementRate: 4.2,
    profileImage: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    socialChannels: ["@beauty_soyoung"],
    isSelected: false,
    status: "pending"
  },
  {
    id: "inf2",
    name: "패션 인플루언서 이민지",
    category: "패션",
    followers: 180000,
    engagementRate: 3.8,
    profileImage: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    socialChannels: ["@fashion_minji"],
    isSelected: false,
    status: "pending"
  },
  {
    id: "inf3",
    name: "라이프스타일 유튜버 박지혜",
    category: "라이프스타일",
    followers: 320000,
    engagementRate: 5.1,
    profileImage: "/lovable-uploads/3d3591d2-96dd-4030-962d-d5bcacde7cde.png",
    socialChannels: ["@lifestyle_jihye"],
    isSelected: false,
    status: "pending"
  }
];

export const mockPersonas: Persona[] = [
  {
    id: "p1",
    name: "20대 직장인 여성",
    productId: "p1",
    age: "20-29",
    interests: ["뷰티", "패션", "커리어"],
    characteristics: ["실용적", "트렌드 민감", "가성비 중시"]
  },
  {
    id: "p2",
    name: "30대 주부",
    productId: "p1",
    age: "30-39",
    interests: ["육아", "라이프스타일", "건강"],
    characteristics: ["신중함", "품질 중시", "가족 우선"]
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
