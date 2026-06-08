@echo off
REM Vercel Build Verification Script for Windows
REM This script verifies that your project is ready for Vercel deployment

echo.
echo 🔍 Vercel Deployment Verification
echo ==================================
echo.

REM Check Node version
echo 📦 Checking Node.js version...
node -v
echo.

REM Check npm version
echo 📦 Checking npm version...
npm -v
echo.

REM Check if .env files are set up
echo 🔐 Checking environment files...
if exist ".env.example" (
    echo    ✓ Root .env.example found
) else (
    echo    ✗ Root .env.example missing
)

if exist "backend\.env.example" (
    echo    ✓ Backend .env.example found
) else (
    echo    ✗ Backend .env.example missing
)
echo.

REM Check Vercel configuration
echo ⚙️  Checking Vercel configuration...
if exist "vercel.json" (
    echo    ✓ vercel.json found
) else (
    echo    ✗ vercel.json missing
)

if exist ".vercelignore" (
    echo    ✓ .vercelignore found
) else (
    echo    ✗ .vercelignore missing
)
echo.

REM Check frontend files
echo 🎨 Checking frontend configuration...
if exist "package.json" (
    echo    ✓ Root package.json found
) else (
    echo    ✗ Root package.json missing
)

if exist "vite.config.js" (
    echo    ✓ vite.config.js found
) else (
    echo    ✗ vite.config.js missing
)
echo.

REM Check backend files
echo 🔧 Checking backend configuration...
if exist "backend\package.json" (
    echo    ✓ Backend package.json found
) else (
    echo    ✗ Backend package.json missing
)

if exist "backend\src\app.js" (
    echo    ✓ Backend app.js found
) else (
    echo    ✗ Backend app.js missing
)

if exist "backend\api\index.js" (
    echo    ✓ Backend API entry point found
) else (
    echo    ✗ Backend API entry point missing
)
echo.

REM Check Prisma
echo 🗄️  Checking database configuration...
if exist "backend\prisma\schema.prisma" (
    echo    ✓ Prisma schema found
) else (
    echo    ✗ Prisma schema missing
)
echo.

echo.
echo ✅ Verification complete!
echo.
echo Next steps:
echo 1. Review VERCEL_DEPLOYMENT.md for detailed instructions
echo 2. Check PRODUCTION_CHECKLIST.md before deploying
echo 3. Connect your repository to Vercel
echo 4. Set environment variables in Vercel dashboard
echo 5. Deploy!
echo.
