export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  errorCode?: string;
}

export type UserRole = "MEMBER" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type FutsalLevel =
  | "ROOKIE"
  | "PLAYMAKER"
  | "STRIKER"
  | "MAESTRO"
  | "LEGEND";

export type ScheduleStatus =
  | "PROPOSED"
  | "FIRST_VOTE_IN_PROGRESS"
  | "FIRST_VOTE_COMPLETED"
  | "CONFIRMED"
  | "CANCELLED";

export interface UserResponse {
  id: number;
  email: string;
  maskedEmail: string;
  name: string;
  gender: Gender;
  residence: string;
  futsalLevel: FutsalLevel;
  cohort: string;
  isCurrentCohort: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  user: UserResponse;
}

export interface ScheduleResponse {
  id: number;
  dateTime: string;
  location: string;
  minParticipants: number;
  firstVoteDeadline: string;
  status: ScheduleStatus;
  memo: string | null;
  generalMemberAllowed: boolean;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledByAdmin: UserResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  importance: string;
  status: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryResponse {
  id: number;
  scheduleId: number;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  uploaderId: number;
  createdAt: string;
}

export interface SettlementResponse {
  id: number;
  scheduleId: number;
  totalCost: number;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  status: string;
  createdAt: string;
}

export type BadgeCategory =
  | "COHORT_PARTICIPATION"
  | "CONSECUTIVE_PARTICIPATION"
  | "COMMEMORATIVE"
  | "LEVEL_UPGRADE"
  | "SPECIAL_EVENT";

export type BadgeGrade =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "LEGENDARY";

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  COHORT_PARTICIPATION: "기수 참여",
  CONSECUTIVE_PARTICIPATION: "연속 참여",
  COMMEMORATIVE: "기념",
  LEVEL_UPGRADE: "레벨 업그레이드",
  SPECIAL_EVENT: "특별 이벤트",
};

export const BADGE_GRADE_LABELS: Record<BadgeGrade, string> = {
  BRONZE: "브론즈",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
  DIAMOND: "다이아몬드",
  LEGENDARY: "레전더리",
};

export interface BadgeResponse {
  id: number;
  name: string;
  description: string;
  category: BadgeCategory | string;
  grade: BadgeGrade | string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface CommentResponse {
  id: number;
  scheduleId: number;
  authorId: number;
  authorName?: string;
  content: string;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FirstVoteStatusResponse {
  participated: boolean;
  participantCount?: number;
  nonParticipantCount?: number;
  [key: string]: unknown;
}

export interface FlexibleVoteStatusResponse {
  participated: boolean;
  participationStatus?: string;
  [key: string]: unknown;
}

export interface VoteSummaryResponse {
  firstVoteParticipantCount?: number;
  firstVoteNonParticipantCount?: number;
  flexibleParticipantCount?: number;
  [key: string]: unknown;
}

export interface SettlementHistoryResponse {
  id: number;
  settlementId: number;
  userId: number;
  scheduleId: number;
  baseAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  penaltyReason?: string;
  status: string;
  completedAt?: string;
  createdAt: string;
}

export interface SettlementStatisticsResponse {
  totalSettlementCount?: number;
  totalPenaltyCount?: number;
  averageAmount?: number;
  totalPenaltyAmount?: number;
  [key: string]: unknown;
}
