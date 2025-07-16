#!/usr/bin/env python3
"""
Test script for the IndianKanoon API server
"""

import requests
import json
import time

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get('http://localhost:5001/health', timeout=5)
        if response.status_code == 200:
            print("✓ Health check passed")
            return True
        else:
            print(f"✗ Health check failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_search():
    """Test the search endpoint"""
    print("\nTesting search endpoint...")
    try:
        data = {
            'query': 'constitutional rights',
            'pagenum': 0,
            'maxpages': 5
        }
        response = requests.post('http://localhost:5001/search', 
                               json=data, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            if 'docs' in result:
                print(f"✓ Search successful - found {len(result['docs'])} results")
                return True
            else:
                print("✗ Search returned no results")
                return False
        else:
            print(f"✗ Search failed with status: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Search failed: {e}")
        return False

def test_document_fetch():
    """Test fetching a document"""
    print("\nTesting document fetch...")
    try:
        # First search for a document
        search_data = {
            'query': 'supreme court',
            'pagenum': 0,
            'maxpages': 1
        }
        search_response = requests.post('http://localhost:5001/search', 
                                      json=search_data, timeout=10)
        
        if search_response.status_code == 200:
            search_result = search_response.json()
            if 'docs' in search_result and len(search_result['docs']) > 0:
                doc_id = search_result['docs'][0]['tid']
                
                # Now fetch the document
                doc_response = requests.get(f'http://localhost:5001/doc/{doc_id}', 
                                          timeout=10)
                
                if doc_response.status_code == 200:
                    print(f"✓ Document fetch successful for ID: {doc_id}")
                    return True
                else:
                    print(f"✗ Document fetch failed with status: {doc_response.status_code}")
                    return False
            else:
                print("✗ No documents found to test with")
                return False
        else:
            print(f"✗ Search failed during document test: {search_response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Document fetch failed: {e}")
        return False

def main():
    print("IndianKanoon API Server Test")
    print("=" * 40)
    
    # Wait a moment for server to be ready
    print("Waiting for server to be ready...")
    time.sleep(2)
    
    tests = [
        test_health_check,
        test_search,
        test_document_fetch
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\nTest Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All tests passed! The API server is working correctly.")
        return 0
    else:
        print("✗ Some tests failed. Please check the server logs.")
        return 1

if __name__ == '__main__':
    exit(main()) 