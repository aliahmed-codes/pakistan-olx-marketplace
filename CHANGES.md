# Changes Summary

This document summarizes all the changes made to the Pakistan OLX Marketplace project.

## Database Schema Updates

### New Models Added
1. **AdView** - Tracks individual ad views with user association
2. **RecentlyViewed** - Tracks recently viewed ads per user
3. **PhoneView** - Tracks when users view phone numbers in chat
4. **UserInterest** - Stores user interests for personalized feed
5. **StoreFollower** - Tracks users following stores

### Updated Models
1. **Ad** - Added `leads` field for lead counting
2. **User** - Added relations to new models
3. **Category** - Added relation to UserInterest
4. **Store** - Added relation to StoreFollower

## New Features Implemented

### 1. Real-time Chat with Socket.IO
- Socket.IO server setup for real-time messaging
- Socket client hook (`useSocket`)
- Real-time message delivery
- Typing indicators
- Message seen status

### 2. Chat UI Improvements
- Unread message count badge in header
- Chat conversations API
- Message seen tracking

### 3. Ad View Tracking
- API endpoint: `/api/ads/[id]/view`
- Tracks unique views per user
- Prevents self-view counting
- Recently viewed ads tracking

### 4. Phone Number View Tracking
- API endpoint: `/api/ads/[id]/phone-view`
- Tracks when users view phone numbers in chat
- Increments lead count

### 5. Lead Counting
- Lead count stored on Ad model
- Incremented on phone view
- Can be extended for other lead actions

### 6. Recently Viewed Ads
- API endpoint: `/api/user/recently-viewed`
- Tracks last 20 viewed ads per user
- Used for personalized recommendations

### 7. Interest-Based Feed
- API endpoint: `/api/ads/feed`
- Shows ads based on user's category interests
- Falls back to featured/recent ads if no interests

### 8. Image Upload on Post Click
- Images are stored locally until user clicks "Post Ad"
- Users can reorder images before posting
- First image becomes cover photo
- All images uploaded together when posting

### 9. Store Feature Enhancements
- Follow/unfollow stores
- Store follower count display
- Chat with store functionality
- Store profile with logo and cover image
- Share store functionality

### 10. Admin Store Management
- Admin page: `/admin/stores`
- View all stores
- Verify/unverify stores
- Activate/deactivate stores
- Delete stores
- Store statistics

### 11. Interested Stores Page
- Page: `/stores/interested`
- Shows stores the user follows
- Quick access to followed stores

### 12. Enhanced Search Page
- Page: `/search`
- Full-text search
- Filter by category, city, condition
- Price range filter
- Sort options (newest, oldest, price, views)
- Mobile-responsive filter sidebar

### 13. Category Pages
- Dynamic category pages: `/categories/[slug]`
- Category index page: `/categories`
- Subcategory filtering
- Category-specific CTAs

### 14. Header/Footer Updates
- Added store links to user menu
- Added store links to footer
- Unread chat count badge in header

## New API Endpoints

### Chat
- `GET /api/chat/unread-count` - Get unread message count
- `GET /api/chat/conversations` - Get user's conversations
- `POST /api/chat/conversations` - Create/get conversation

### Ads
- `POST /api/ads/[id]/view` - Track ad view
- `POST /api/ads/[id]/phone-view` - Track phone view
- `GET /api/ads/feed` - Get personalized feed

### User
- `GET /api/user/recently-viewed` - Get recently viewed ads
- `GET /api/user/interests` - Get user interests
- `POST /api/user/interests` - Add interest
- `DELETE /api/user/interests` - Remove interest

### Stores
- `GET /api/stores/interested` - Get followed stores
- `POST /api/stores/[id]/follow` - Follow store
- `DELETE /api/stores/[id]/follow` - Unfollow store
- `GET /api/stores/[id]/follow` - Check follow status

### Admin
- `GET /api/admin/stores` - Get all stores (admin)
- `GET /api/admin/stores/[id]` - Get store details (admin)
- `PATCH /api/admin/stores/[id]` - Update store (admin)
- `DELETE /api/admin/stores/[id]` - Delete store (admin)

## New Pages

### Store Pages
- `/stores` - Browse all stores
- `/stores/[slug]` - Store detail page
- `/stores/create` - Create store page
- `/stores/my-store` - My store dashboard
- `/stores/interested` - Followed stores

### Category Pages
- `/categories` - All categories
- `/categories/[slug]` - Category detail page

### Search Page
- `/search` - Search with filters

### Admin Pages
- `/admin/stores` - Store management

## Updated Pages

### Post Ad Page
- Images upload on post click
- Image reordering functionality
- Cover photo selection

### Store Detail Page
- Follow/unfollow button
- Chat with store button
- Share functionality
- Store profile with logo

### Navbar
- Unread chat count badge
- Store link in user menu

### Footer
- Store links added

## New Hooks

- `useSocket.ts` - Socket.IO client hook
- `useUnreadCount.ts` - Unread message count hook

## New Components

- Socket.IO server setup
- Real-time chat integration

## Files to Run Migration

After pulling these changes, run:

```bash
# Install new dependencies
npm install

# Run database migration
npx prisma migrate dev --name add_tracking_features

# Regenerate Prisma client
npx prisma generate

# Start the server
npm run dev
```

## Environment Variables

Make sure these are set in your `.env`:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Socket.IO (optional, defaults to current URL)
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

## Notes

- The Socket.IO server is started via `server.js` instead of the default Next.js server
- Use `npm run dev` to start the development server with Socket.IO
- The custom server is required for Socket.IO to work properly
