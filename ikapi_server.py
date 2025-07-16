from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
from ikapi import IKApi
import argparse
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global IKApi instance
ik_api = None

def initialize_ik_api():
    """Initialize the IKApi instance with default settings"""
    global ik_api
    
    # Create a mock args object with default values
    class MockArgs:
        def __init__(self):
            self.token = '7d7886e815e945cdf7fafdb557eaf347cbe12dca'  # Default token
            self.maxcites = 10
            self.maxcitedby = 10
            self.orig = False
            self.maxpages = 10
            self.pathbysrc = False
            self.numworkers = 1
            self.addedtoday = False
            self.fromdate = None
            self.todate = None
            self.sortby = None
    
    # Create a mock storage object
    class MockStorage:
        def __init__(self):
            pass
        
        def get_json_path(self, q):
            return f"/tmp/ikapi_{hash(q)}.json"
        
        def save_json(self, jsonstr, jsonpath):
            try:
                with open(jsonpath, 'w', encoding='utf-8') as f:
                    f.write(jsonstr)
                return True
            except Exception as e:
                logger.error(f"Error saving JSON: {e}")
                return False
    
    args = MockArgs()
    storage = MockStorage()
    ik_api = IKApi(args, storage)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'IKApi server is running'})

@app.route('/search', methods=['POST'])
def search_cases():
    """Search for legal cases"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        pagenum = data.get('pagenum', 0)
        maxpages = data.get('maxpages', 10)
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        logger.info(f"Searching for: {query}, page: {pagenum}")
        
        # Use the IKApi search method
        results = ik_api.search(query, pagenum, maxpages)
        
        if not results:
            return jsonify({'error': 'No results found'}), 404
        
        # Parse the JSON response
        try:
            parsed_results = json.loads(results)
            return jsonify(parsed_results)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {e}")
            return jsonify({'error': 'Invalid response format'}), 500
            
    except Exception as e:
        logger.error(f"Error in search_cases: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/doc/<int:docid>', methods=['GET'])
def get_document(docid):
    """Get document details by ID"""
    try:
        logger.info(f"Fetching document: {docid}")
        
        # Use the IKApi fetch_doc method
        results = ik_api.fetch_doc(docid)
        
        if not results:
            return jsonify({'error': 'Document not found'}), 404
        
        # Parse the JSON response
        try:
            parsed_results = json.loads(results)
            return jsonify(parsed_results)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {e}")
            return jsonify({'error': 'Invalid response format'}), 500
            
    except Exception as e:
        logger.error(f"Error in get_document: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/docmeta/<int:docid>', methods=['GET'])
def get_document_meta(docid):
    """Get document metadata by ID"""
    try:
        logger.info(f"Fetching document metadata: {docid}")
        
        # Use the IKApi fetch_docmeta method
        results = ik_api.fetch_docmeta(docid)
        
        if not results:
            return jsonify({'error': 'Document metadata not found'}), 404
        
        # Parse the JSON response
        try:
            parsed_results = json.loads(results)
            return jsonify(parsed_results)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {e}")
            return jsonify({'error': 'Invalid response format'}), 500
            
    except Exception as e:
        logger.error(f"Error in get_document_meta: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/docfragment/<int:docid>', methods=['POST'])
def get_document_fragment(docid):
    """Get document fragment by ID and query"""
    try:
        data = request.get_json()
        query = data.get('formInput', '')
        
        if not query:
            return jsonify({'error': 'formInput is required'}), 400
        
        logger.info(f"Fetching document fragment: {docid}, query: {query}")
        
        # Use the IKApi fetch_doc_fragment method
        results = ik_api.fetch_doc_fragment(docid, query)
        
        if not results:
            return jsonify({'error': 'Document fragment not found'}), 404
        
        # Parse the JSON response
        try:
            parsed_results = json.loads(results)
            return jsonify(parsed_results)
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {e}")
            return jsonify({'error': 'Invalid response format'}), 500
            
    except Exception as e:
        logger.error(f"Error in get_document_fragment: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize the IKApi instance
    initialize_ik_api()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 