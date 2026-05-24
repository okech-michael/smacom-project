#!/bin/bash

# Bash script to help deploy the SMACOM project to Vercel
# For Linux/macOS users

set -e

echo ""
echo "============================================"
echo "SMACOM - Vercel Deployment Script"
echo "============================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "[ERROR] Vercel CLI is not installed."
    echo "Please install it with: npm install -g vercel"
    exit 1
fi

# Check if Node.js/npm is available
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed."
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[1/5] Checking frontend dependencies..."
cd green-cycle-hub

if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies with npm..."
    npm install --legacy-peer-deps
else
    echo "[✓] Dependencies already installed"
fi

echo ""
echo "[2/5] Building frontend..."
npm run build
echo "[✓] Build successful"

cd ..

echo ""
echo "[3/5] Verifying deployment configuration..."
if [ -f "vercel.json" ]; then
    echo "[✓] vercel.json found"
else
    echo "[ERROR] vercel.json not found"
    exit 1
fi

echo ""
echo "[4/5] Deploying to Vercel..."
echo "Please log in to Vercel if prompted..."
echo ""

vercel --prod

echo ""
echo "[✓] Deployment completed successfully!"
echo ""
echo "============================================"
echo "Next Steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Set environment variables in project settings:"
echo "   - VITE_API_URL=https://your-backend-url.com"
echo "3. Redeploy the project"
echo "4. Test your application at the provided URL"
echo "============================================"
echo ""
