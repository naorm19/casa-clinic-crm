@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo ================================
echo   Casa Clinic CRM - Build
echo ================================
echo.

echo [1/3] מריץ build...
call npm run build
if errorlevel 1 (
    echo.
    echo שגיאה ב-build! בדוק ש-Node.js מותקן.
    pause
    exit /b 1
)

echo.
echo [2/3] Build הצליח! פותח Netlify Drop...
start https://app.netlify.com/drop

echo.
echo [3/3] פותח את תיקיית dist לגרור לנטליפיי...
timeout /t 2 /nobreak > nul
explorer "%~dp0dist"

echo.
echo ================================
echo  גרור את תיקיית dist לאתר
echo  netlify.com/drop שנפתח
echo ================================
pause
