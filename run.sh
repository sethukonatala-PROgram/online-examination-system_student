#!/usr/bin/env bash
# ExamPulse Assessment Portal Launcher

echo "========================================================="
echo "  ExamPulse - Smart Online Examination & Assessment System"
echo "========================================================="

if command -v python3 &> /dev/null; then
    python3 server.py --port 8080
elif command -v python &> /dev/null; then
    python server.py --port 8080
else
    echo "Opening index.html directly..."
    if command -v xdg-open &> /dev/null; then
        xdg-open index.html
    elif command -v open &> /dev/null; then
        open index.html
    fi
fi
