#!/bin/bash

# Script to push changes to GitHub
# Run this script from the project root directory

set -e

echo "=== Pushing Pakistan OLX Marketplace to GitHub ==="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -m main
fi

# Configure git (if not already configured)
if [ -z "$(git config user.email)" ]; then
    echo "Please enter your git email:"
    read git_email
    git config user.email "$git_email"
fi

if [ -z "$(git config user.name)" ]; then
    echo "Please enter your git name:"
    read git_name
    git config user.name "$git_name"
fi

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "Adding remote origin..."
    git remote add origin https://github.com/aliahmed-codes/pakistan-olx-marketplace.git
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Prisma
prisma/*.db
prisma/migrations/*/migration_lock.toml

# Uploads
uploads/
public/uploads/

# Temporary files
*.tmp
*.temp
EOF
fi

# Add all files
echo "Adding files to git..."
git add .

# Commit
echo "Committing changes..."
git commit -m "feat: Add real-time chat, store features, tracking, and enhanced search

- Add Socket.IO for real-time chat with typing indicators and message seen status
- Add unread chat count badge in header
- Add ad view tracking and recently viewed ads
- Add phone number view tracking in chat with lead counting
- Add interest-based personalized feed
- Update post-ad page to upload images on post click with reordering
- Add store follow/unfollow functionality
- Add chat with store feature
- Add admin store management page
- Add interested stores page for users
- Add enhanced search page with filters
- Add dynamic category pages
- Update header/footer with store links
- Add database models for tracking (AdView, PhoneView, RecentlyViewed, UserInterest, StoreFollower)"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "=== Successfully pushed to GitHub! ==="
echo "Repository: https://github.com/aliahmed-codes/pakistan-olx-marketplace"
