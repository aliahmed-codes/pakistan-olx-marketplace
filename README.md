# Pakistan OLX-Style Marketplace

A production-ready classified marketplace platform similar to OLX for Pakistan, built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Core Features
- **User Authentication**: Register, login, logout with JWT-based sessions
- **Ad Management**: Create, edit, delete ads with image uploads
- **Categories**: 13 main categories with 100+ sub-categories
- **Search & Filter**: Full-text search with multiple filter options
- **Chat System**: Real-time messaging between buyers and sellers
- **Favorites**: Save and manage favorite ads

### Advanced Features
- **Commission System**: Configurable 2% commission on sold items
- **Store Feature**: Create and manage your own online store
- **Featured Ads**: Promote ads with paid featuring
- **Admin Dashboard**: Complete admin panel for management
- **Email System**: Automated emails with Nodemailer
- **Responsive Design**: Works on all devices

### Static Pages
- Home, Categories, About, Contact, Careers
- Terms of Use, Privacy Policy
- Support, Help Center, Safety Tips, Posting Rules
- Advertise With Us

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js with JWT
- **Image Upload**: Cloudinary
- **Email**: Nodemailer

## 📦 Installation

1. **Clone the repository**
```bash
cd pakistan-olx-marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/marketplace"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Admin Credentials
ADMIN_EMAIL="admin@marketplace.pk"
ADMIN_PASSWORD="admin123456"
```

4. **Set up the database**
```bash
# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔑 Default Credentials

**Admin Account:**
- Email: admin@marketplace.pk
- Password: admin123456

⚠️ **Important**: Change the default admin password after first login!

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages (login, register)
│   ├── (main)/           # Main app pages (home, ads, profile)
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   ├── categories/       # Category pages
│   ├── stores/           # Store pages
│   └── ...               # Static pages
├── components/           # React components
├── lib/                  # Utility functions
│   ├── categories.ts     # Category definitions
│   ├── cities-areas.ts   # City/area data
│   ├── email.ts          # Email utilities
│   └── ...
└── types/                # TypeScript types
```

## 🎯 Key Features Explained

### Commission System
The platform includes a configurable commission system:
- Enable/disable commission via admin settings
- Configurable commission percentage (default: 2%)
- Automatic commission calculation when items are marked as sold
- Payment tracking and admin verification

### Store Feature
Users can create their own stores:
- Professional store profile with logo and cover image
- Store verification badges
- Centralized ad management
- Store analytics and insights

### Featured Ads
Promote ads for better visibility:
- Manual bank transfer payment
- 7-day featured duration
- Top placement in search results
- Admin approval workflow

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- CSRF protection
- Secure session management

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session

### Ads
- `GET /api/ads` - List ads
- `POST /api/ads` - Create ad
- `GET /api/ads/[id]` - Get ad details
- `PUT /api/ads/[id]` - Update ad
- `DELETE /api/ads/[id]` - Delete ad
- `POST /api/ads/[id]/sold` - Mark ad as sold

### Commission
- `GET /api/commission/config` - Get commission settings
- `PUT /api/commission/config` - Update commission settings
- `POST /api/commission/pay` - Pay commission

### Stores
- `GET /api/stores` - List stores
- `POST /api/stores` - Create store
- `GET /api/stores/[slug]` - Get store details
- `PUT /api/stores/[slug]` - Update store
- `DELETE /api/stores/[slug]` - Delete store
- `GET /api/stores/my-store` - Get current user's store

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - List users
- `GET /api/admin/ads` - List all ads
- `GET /api/admin/feature-requests` - List feature requests
- `GET /api/admin/reports` - List reports

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Deploy to Vercel
```bash
vercel --prod
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@marketplace.pk or visit our [Help Center](/help-center).

---

Built with ❤️ for Pakistan
# pakistan-olx-marketplace
