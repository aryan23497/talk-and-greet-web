# IndianKanoon API Integration Setup Guide

This guide explains how to set up and use the new IndianKanoon API integration that uses `ikapi.py` to avoid API errors.

## Overview

The project now uses a custom Flask server that wraps the `ikapi.py` functionality to provide a reliable API for the frontend. This approach:

- ✅ Avoids direct API errors from IndianKanoon
- ✅ Provides better error handling and retry logic
- ✅ Offers a consistent REST API interface
- ✅ Includes health checks and monitoring

## Quick Start

### Option 1: One-Click Start (Recommended)

**Windows:**
```bash
start_project.bat
```

**macOS/Linux:**
```bash
./start_project.sh
```

### Option 2: Manual Setup

1. **Start the API Server:**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Start the Flask server
   python ikapi_server.py
   ```

2. **Start the Frontend:**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

## API Endpoints

The Flask server provides these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/search` | POST | Search for legal cases |
| `/doc/{docid}` | GET | Get document details |
| `/docmeta/{docid}` | GET | Get document metadata |
| `/docfragment/{docid}` | POST | Get document fragments |

## Testing the Setup

Run the test script to verify everything is working:

```bash
python test_api.py
```

This will test:
- Health check endpoint
- Search functionality
- Document fetching

## Troubleshooting

### Common Issues

1. **"API Server Not Connected"**
   - Make sure the Flask server is running on port 5001
   - Check that `ikapi.py` is in the project root
   - Verify Python dependencies are installed

2. **"Module not found" errors**
   - Run: `pip install -r requirements.txt`
   - Make sure you're using Python 3.7+

3. **Port already in use**
   - Stop any existing servers on port 5001
   - Check for other Flask applications

4. **CORS errors**
   - The Flask server includes CORS support
   - Make sure the frontend is accessing `http://localhost:5001`

### Debug Mode

To run the Flask server in debug mode with more detailed logs:

```bash
export FLASK_ENV=development
python ikapi_server.py
```

## File Structure

```
talk-and-greet-web/
├── ikapi.py                 # Original IndianKanoon API wrapper
├── ikapi_server.py          # Flask server that wraps ikapi.py
├── requirements.txt         # Python dependencies
├── start_server.py          # Python startup script
├── start_server.bat         # Windows batch file for API server
├── start_project.bat        # Windows batch file for full project
├── start_project.sh         # Shell script for full project
├── test_api.py              # API testing script
├── src/
│   └── services/
│       └── indianKanoonService.ts  # Updated frontend service
└── README.md                # Updated project documentation
```

## Configuration

### API Token

The API token is configured in `ikapi_server.py`. To change it:

1. Edit the `token` field in the `MockArgs` class
2. Restart the Flask server

### Server Settings

You can modify these settings in `ikapi_server.py`:

- `maxcites`: Maximum citations to fetch (default: 10)
- `maxcitedby`: Maximum cited-by references (default: 10)
- `maxpages`: Maximum pages per search (default: 10)

## Development

### Adding New Endpoints

To add new API endpoints:

1. Add the endpoint to `ikapi_server.py`
2. Update the frontend service in `indianKanoonService.ts`
3. Test with `test_api.py`

### Modifying API Behavior

The Flask server wraps the `IKApi` class from `ikapi.py`. You can:

- Modify the `MockArgs` class to change API behavior
- Add new methods to the Flask app
- Customize error handling and responses

## Security Notes

- The API token is embedded in the server code
- The server runs on localhost only
- CORS is enabled for development
- For production, consider environment variables for sensitive data

## Support

If you encounter issues:

1. Check the server logs for error messages
2. Run `python test_api.py` to verify API functionality
3. Ensure all dependencies are installed
4. Verify `ikapi.py` is present and accessible

## Migration from Old Setup

If you were using the previous proxy setup:

1. Stop the old proxy server (`proxy.cjs`)
2. Start the new Flask server (`ikapi_server.py`)
3. The frontend will automatically connect to the new API
4. No changes needed to the frontend code

The new setup is backward compatible and provides the same functionality with better reliability. 