#!/usr/bin/env python3
"""
Startup script for the IndianKanoon API server
"""

import subprocess
import sys
import time
import requests
from pathlib import Path

def check_python_dependencies():
    """Check if required Python packages are installed"""
    required_packages = ['flask', 'flask_cors']
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✓ {package} is installed")
        except ImportError:
            print(f"✗ {package} is not installed")
            print(f"Please install it using: pip install {package}")
            return False
    return True

def install_dependencies():
    """Install required dependencies"""
    print("Installing required dependencies...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install dependencies: {e}")
        return False

def start_server():
    """Start the Flask server"""
    print("Starting IndianKanoon API server...")
    try:
        # Start the server
        process = subprocess.Popen([sys.executable, 'ikapi_server.py'])
        
        # Wait a moment for the server to start
        time.sleep(3)
        
        # Check if server is running
        try:
            response = requests.get('http://localhost:5001/health', timeout=5)
            if response.status_code == 200:
                print("✓ Server is running on http://localhost:5001")
                print("✓ Health check passed")
                return process
            else:
                print(f"✗ Server health check failed with status: {response.status_code}")
                process.terminate()
                return None
        except requests.exceptions.RequestException as e:
            print(f"✗ Server health check failed: {e}")
            process.terminate()
            return None
            
    except Exception as e:
        print(f"✗ Failed to start server: {e}")
        return None

def main():
    print("IndianKanoon API Server Startup")
    print("=" * 40)
    
    # Check if ikapi.py exists
    if not Path('ikapi.py').exists():
        print("✗ ikapi.py not found in current directory")
        print("Please make sure ikapi.py is in the same directory as this script")
        return 1
    
    # Check Python dependencies
    if not check_python_dependencies():
        print("\nInstalling missing dependencies...")
        if not install_dependencies():
            return 1
    
    # Start the server
    process = start_server()
    if not process:
        return 1
    
    print("\nServer is ready!")
    print("You can now start your frontend application.")
    print("Press Ctrl+C to stop the server.")
    
    try:
        # Keep the script running
        process.wait()
    except KeyboardInterrupt:
        print("\nStopping server...")
        process.terminate()
        process.wait()
        print("Server stopped.")
    
    return 0

if __name__ == '__main__':
    sys.exit(main()) 