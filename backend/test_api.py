#!/usr/bin/env python3
"""
Test script to demonstrate the Quiz App backend functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    print("✓ Health check passed\n")

def test_questions():
    """Test the questions endpoint"""
    print("Testing questions endpoint...")
    response = requests.get(f"{BASE_URL}/api/questions/")
    assert response.status_code == 200
    questions = response.json()
    assert len(questions) == 3
    print(f"✓ Found {len(questions)} questions\n")
    
    for q in questions:
        print(f"  - {q['title']} ({q['type']})")
    print()

def test_specific_question():
    """Test getting a specific question"""
    print("Testing specific question endpoint...")
    response = requests.get(f"{BASE_URL}/api/questions/parsons-1")
    assert response.status_code == 200
    question = response.json()
    assert question["id"] == "parsons-1"
    assert question["title"] == "Sort a List in Python"
    assert len(question["code_lines"]) == 3
    print("✓ Retrieved question successfully")
    print(f"  Title: {question['title']}")
    print(f"  Code lines: {len(question['code_lines'])}")
    print()

def main():
    print("=" * 60)
    print("Quiz App Backend Tests")
    print("=" * 60)
    print()
    
    try:
        test_health()
        test_questions()
        test_specific_question()
        
        print("=" * 60)
        print("All tests passed! ✓")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}")
        return 1
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
