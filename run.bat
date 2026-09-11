@echo off
title ExamPulse Assessment Portal
echo =========================================================
echo   ExamPulse - Smart Online Examination & Assessment System
echo =========================================================
echo Starting local assessment portal...
echo.

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python server.py --port 8080
) else (
    echo Opening index.html directly in your default browser...
    start "" index.html
)

pause
