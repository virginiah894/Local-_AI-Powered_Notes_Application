import sys
print(f"Python version: {sys.version}")
print(f"Python path: {sys.path}")

try:
    from app.ml.sentiment import analyze_sentiment
    print("Sentiment analysis module imported successfully")
    
    # Test cases
    test_cases = [
        {"text": "I love this product, it's amazing!", "expected": "positive"},
        {"text": "This is okay, nothing special.", "expected": "neutral"},
        {"text": "I hate this, it's terrible.", "expected": "negative"},
        {"text": "This is not bad at all.", "expected": "positive"},  # Testing negation
        {"text": "", "expected": "neutral"},  # Edge case: empty text
        {"text": "!@#$%^&*()", "expected": "neutral"},  # Edge case: non-text characters
    ]
    
    print("\nRunning sentiment analysis tests:")
    print("=" * 50)
    
    for i, case in enumerate(test_cases):
        text = case["text"]
        expected = case["expected"]
        
        print(f"\nTest case {i+1}:")
        print(f"Text: '{text}'")
        print(f"Expected: '{expected}'")
        
        result = analyze_sentiment(text)
        print(f"Result: '{result}'")
        
        if result == expected:
            print("✅ Test PASSED")
        else:
            print("❌ Test FAILED")
    
    print("\n" + "=" * 50)
    print("Sentiment analysis tests completed")
    
except ImportError as e:
    print(f"Import error: {e}")
except Exception as e:
    print(f"Error: {e}")