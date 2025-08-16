@echo off
echo ========================================
echo   ATM Franchise Translation Script
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create a .env file:
    echo 1. Copy .env.example to .env
    echo 2. Add your Google API key to .env
    echo.
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo Now edit .env and add your Google API key
    echo Then run this script again.
    pause
    exit /b 1
)

echo Checking for translations...
echo.

REM Run the translation script
node scripts/translate-content.cjs translate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Translation completed successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   Translation failed!
    echo   Check the error message above
    echo ========================================
)

pause