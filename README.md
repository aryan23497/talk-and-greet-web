# Talk and Greet Web - Legal Chatbot

A React-based legal chatbot application that provides legal information and advice using the IndianKanoon API.

## Project info

**URL**: https://lovable.dev/projects/55820fd6-c293-4fd3-868d-497ad2ac110e

## Features

- Legal case search and information
- Interactive chatbot interface
- Real-time legal advice
- Integration with IndianKanoon legal database
- Modern, responsive UI built with shadcn/ui

## Prerequisites

Before running this project, you need:

1. **Node.js & npm** - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
2. **Python 3.7+** - [download from python.org](https://python.org)
3. **ikapi.py** - The IndianKanoon API wrapper (should be in the project root)

## Setup Instructions

### Step 1: Start the IndianKanoon API Server

The project uses a custom Flask server that wraps the `ikapi.py` functionality to avoid API errors.

**Option A: Using the startup script (Recommended)**
```bash
# On Windows
start_server.bat

# On macOS/Linux
python start_server.py
```

**Option B: Manual setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python ikapi_server.py
```

The server will start on `http://localhost:5001`

### Step 2: Start the Frontend Application

In a new terminal window:

```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/55820fd6-c293-4fd3-868d-497ad2ac110e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Start the IndianKanoon API server (see Step 1 above)

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## API Endpoints

The Flask server provides the following endpoints:

- `GET /health` - Health check
- `POST /search` - Search for legal cases
- `GET /doc/{docid}` - Get document details
- `GET /docmeta/{docid}` - Get document metadata
- `POST /docfragment/{docid}` - Get document fragments

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend
- Python Flask
- IndianKanoon API (via ikapi.py)
- CORS support

## Troubleshooting

### API Server Issues
- Make sure `ikapi.py` is in the project root directory
- Check that Python 3.7+ is installed
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check the server logs for any error messages

### Frontend Issues
- Ensure the API server is running on port 5001
- Check browser console for any CORS or network errors
- Verify that all npm dependencies are installed

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/55820fd6-c293-4fd3-868d-497ad2ac110e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
