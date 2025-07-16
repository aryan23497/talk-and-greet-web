@echo off
echo Starting IndianKanoon API Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if ikapi.py exists
if not exist "ikapi.py" (
    echo Error: ikapi.py not found in current directory
    echo Please make sure ikapi.py is in the same directory as this script
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo.
echo Starting server...
python ikapi_server.py

pause 