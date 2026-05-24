@REM Batch script to help deploy the SMACOM project to Vercel
@REM This script automates the deployment process

@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================
echo SMACOM - Vercel Deployment Script
echo ============================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI is not installed.
    echo Please install it with: npm install -g vercel
    pause
    exit /b 1
)

REM Check if Node.js/npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Checking frontend dependencies...
cd green-cycle-hub
if not exist node_modules (
    echo [*] Installing dependencies with npm...
    call npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [✓] Dependencies already installed
)

echo.
echo [2/5] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [✓] Build successful

cd ..

echo.
echo [3/5] Verifying deployment configuration...
if exist vercel.json (
    echo [✓] vercel.json found
) else (
    echo [ERROR] vercel.json not found
    pause
    exit /b 1
)

echo.
echo [4/5] Deploying to Vercel...
echo Please log in to Vercel if prompted...
echo.

call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo.
echo [✓] Deployment completed successfully!
echo.
echo ============================================
echo Next Steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Set environment variables in project settings:
echo    - VITE_API_URL=https://your-backend-url.com
echo 3. Redeploy the project
echo 4. Test your application at the provided URL
echo ============================================
echo.
pause
