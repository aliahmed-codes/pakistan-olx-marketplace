import { User, Ad, Category, Conversation, Message, Favorite, Report, FeatureRequest } from '@prisma/client';

// ==================== USER TYPES ====================

export type SafeUser = Omit<User, 'password'>;

export type UserWithStats = SafeUser & {
  _count: {
    ads: number;
    favorites: number;
  };
};

// ==================== AD TYPES ====================

export type AdWithUser = Ad & {
  user: SafeUser;
};

export type AdWithCategory = Ad & {
  category: Category;
};

export type AdWithRelations = Ad & {
  user: SafeUser;
  category: Category;
  _count?: {
    favorites: number;
    conversations: number;
  };
};

export type AdCardData = Pick<
  Ad,
  'id' | 'title' | 'price' | 'images' | 'city' | 'condition' | 'isFeatured' | 'createdAt'
> & {
  category: Pick<Category, 'name' | 'slug'>;
};

// ==================== CATEGORY TYPES ====================

export type CategoryWithCount = Category & {
  _count: {
    ads: number;
  };
};

// ==================== CHAT TYPES ====================

export type ConversationWithRelations = Conversation & {
  ad: AdWithUser;
  user: SafeUser;
  messages: Message[];
  _count?: {
    messages: number;
  };
};

export type MessageWithSender = Message & {
  sender: SafeUser;
};

export type ConversationPreview = Conversation & {
  ad: Pick<Ad, 'id' | 'title' | 'images' | 'price'>;
  user: SafeUser;
  lastMessage?: Message;
  unreadCount: number;
};

// ==================== FAVORITE TYPES ====================

export type FavoriteWithAd = Favorite & {
  ad: AdWithRelations;
};

// ==================== REPORT TYPES ====================

export type ReportWithRelations = Report & {
  ad: AdWithUser;
  reporter: SafeUser;
};

// ==================== FEATURE REQUEST TYPES ====================

export type FeatureRequestWithRelations = FeatureRequest & {
  ad: AdWithUser;
  user: SafeUser;
};

// ==================== API RESPONSE TYPES ====================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

// ==================== SEARCH/FILTER TYPES ====================

export type AdFilters = {
  category?: string;
  city?: string;
  condition?: 'NEW' | 'USED';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
};

// ==================== FORM TYPES ====================

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
};

export type AdFormData = {
  title: string;
  description: string;
  price: number;
  condition: 'NEW' | 'USED';
  categoryId: string;
  city: string;
  area?: string;
  phone?: string;
  images: string[];
};

export type FeatureRequestFormData = {
  adId: string;
  screenshotImage: string;
};

export type ReportFormData = {
  adId: string;
  reason: string;
  description?: string;
};

// ==================== SOCKET TYPES ====================

export type SocketEvents = {
  'message:send': {
    conversationId: string;
    content: string;
    receiverId: string;
  };
  'message:received': Message;
  'conversation:join': string;
  'conversation:leave': string;
  'typing:start': { conversationId: string; userId: string };
  'typing:stop': { conversationId: string; userId: string };
  'user:online': string;
  'user:offline': string;
};

// ==================== ADMIN DASHBOARD TYPES ====================

export type DashboardStats = {
  totalUsers: number;
  totalAds: number;
  pendingAds: number;
  featuredAds: number;
  pendingFeatureRequests: number;
  totalReports: number;
  recentUsers: SafeUser[];
  recentAds: AdWithRelations[];
};

// ==================== NAVIGATION TYPES ====================

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  badge?: number;
  adminOnly?: boolean;
};

// ==================== SEO TYPES ====================

export type SEOData = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
};
