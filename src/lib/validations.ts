import { z } from 'zod';

// ==================== AUTH VALIDATIONS ====================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return /^((\+92)|(0092)|0)?3\d{9}$/.test(val.replace(/\s/g, ''));
        },
        { message: 'Please enter a valid Pakistani phone number' }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ==================== USER VALIDATIONS ====================

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^((\+92)|(0092)|0)?3\d{9}$/.test(val.replace(/\s/g, ''));
      },
      { message: 'Please enter a valid Pakistani phone number' }
    ),
  profileImage: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==================== AD VALIDATIONS ====================

export const adSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(70, 'Title must not exceed 70 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description is too long'),
  price: z.coerce.number().min(0, 'Price must be a positive number').max(999999999, 'Price is too high'),
  condition: z.enum(['NEW', 'USED'], {
    required_error: 'Please select a condition',
  }),
  categoryId: z.string().min(1, 'Please select a category'),
  city: z.string().min(1, 'Please select a city'),
  area: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^((\+92)|(0092)|0)?3\d{9}$/.test(val.replace(/\s/g, ''));
      },
      { message: 'Please enter a valid Pakistani phone number' }
    ),
  images: z.array(z.string()).min(1, 'Please upload at least one image').max(8, 'Maximum 8 images allowed'),
});

export type AdInput = z.infer<typeof adSchema>;

// ==================== SEARCH VALIDATIONS ====================

export const searchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  condition: z.enum(['NEW', 'USED']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ==================== FEATURE REQUEST VALIDATIONS ====================

export const featureRequestSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  screenshotImage: z.string().min(1, 'Please upload payment screenshot'),
});

export type FeatureRequestInput = z.infer<typeof featureRequestSchema>;

// ==================== REPORT VALIDATIONS ====================

export const reportSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  reason: z.enum(['SPAM', 'FRAUD', 'INAPPROPRIATE', 'DUPLICATE', 'OTHER'], {
    required_error: 'Please select a reason',
  }),
  description: z.string().max(500, 'Description is too long').optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;

// ==================== CHAT VALIDATIONS ====================

export const messageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
});

export type MessageInput = z.infer<typeof messageSchema>;

// ==================== ADMIN VALIDATIONS ====================

export const banUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  reason: z.string().optional(),
});

export type BanUserInput = z.infer<typeof banUserSchema>;

export const approveAdSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});

export type ApproveAdInput = z.infer<typeof approveAdSchema>;

export const processFeatureRequestSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export type ProcessFeatureRequestInput = z.infer<typeof processFeatureRequestSchema>;

// ==================== CATEGORY VALIDATIONS ====================

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description is too long').optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ==================== BANK DETAILS VALIDATIONS ====================

export const bankDetailsSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountTitle: z.string().min(2, 'Account title is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  iban: z.string().min(5, 'IBAN is required'),
  branchCode: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;
