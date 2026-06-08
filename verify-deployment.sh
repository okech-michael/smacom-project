#!/bin/bash

# Vercel Build Verification Script
# This script verifies that your project is ready for Vercel deployment

echo "🔍 Vercel Deployment Verification"
echo "=================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node_version=$(node -v)
echo "   Node: $node_version"
echo ""

# Check npm version
echo "📦 Checking npm version..."
npm_version=$(npm -v)
echo "   npm: $npm_version"
echo ""

# Check if .env files are set up
echo "🔐 Checking environment files..."
if [ -f ".env.example" ]; then
    echo "   ✓ Root .env.example found"
else
    echo "   ✗ Root .env.example missing"
fi

if [ -f "backend/.env.example" ]; then
    echo "   ✓ Backend .env.example found"
else
    echo "   ✗ Backend .env.example missing"
fi
echo ""

# Check Vercel configuration
echo "⚙️  Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    echo "   ✓ vercel.json found"
else
    echo "   ✗ vercel.json missing"
fi

if [ -f ".vercelignore" ]; then
    echo "   ✓ .vercelignore found"
else
    echo "   ✗ .vercelignore missing"
fi
echo ""

# Check frontend files
echo "🎨 Checking frontend configuration..."
if [ -f "package.json" ]; then
    echo "   ✓ Root package.json found"
else
    echo "   ✗ Root package.json missing"
fi

if [ -f "vite.config.js" ]; then
    echo "   ✓ vite.config.js found"
else
    echo "   ✗ vite.config.js missing"
fi
echo ""

# Check backend files
echo "🔧 Checking backend configuration..."
if [ -f "backend/package.json" ]; then
    echo "   ✓ Backend package.json found"
else
    echo "   ✗ Backend package.json missing"
fi

if [ -f "backend/src/app.js" ]; then
    echo "   ✓ Backend app.js found"
else
    echo "   ✗ Backend app.js missing"
fi

if [ -f "backend/api/index.js" ]; then
    echo "   ✓ Backend API entry point found"
else
    echo "   ✗ Backend API entry point missing"
fi
echo ""

# Check Prisma
echo "🗄️  Checking database configuration..."
if [ -f "backend/prisma/schema.prisma" ]; then
    echo "   ✓ Prisma schema found"
else
    echo "   ✗ Prisma schema missing"
fi
echo ""

# Verify build commands
echo "🏗️  Verifying build commands..."
echo "   Frontend build: npm run build"
npm run build 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✓ Frontend build successful"
else
    echo "   ✗ Frontend build failed"
fi
echo ""

echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Review VERCEL_DEPLOYMENT.md for detailed instructions"
echo "2. Check PRODUCTION_CHECKLIST.md before deploying"
echo "3. Connect your repository to Vercel"
echo "4. Set environment variables in Vercel dashboard"
echo "5. Deploy!"
