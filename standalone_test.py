import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Simple word lists for sentiment analysis
POSITIVE_WORDS = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
    'terrific', 'outstanding', 'superb', 'brilliant', 'awesome', 'love',
    'happy', 'joy', 'pleased', 'delighted', 'satisfied', 'impressive'
]

NEGATIVE_WORDS = [
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing',
    'hate', 'dislike', 'angry', 'sad', 'upset', 'annoying', 'frustrating',
    'mediocre', 'inferior', 'worst', 'failure', 'problem', 'issue'
]

def analyze_sentiment(text: str) -> str:
    """
    Analyze the sentiment of the given text using a simple rule-based approach.
    Returns 'positive', 'neutral', or 'negative'.
    """
    # Input validation
    if not text or not isinstance(text, str):
        return "neutral"  # Default to neutral for invalid input
        
    if len(text.strip()) == 0:
        return "neutral"  # Default to neutral for empty text
    
    try:
        # Convert to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Count positive and negative words
        positive_count = 0
        negative_count = 0
        
        # Check for positive words
        for word in POSITIVE_WORDS:
            positive_count += len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))
            
        # Check for negative words
        for word in NEGATIVE_WORDS:
            negative_count += len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))
            
        # Check for negations (simple approach)
        negations = len(re.findall(r'\b(not|no|never|don\'t|doesn\'t|didn\'t|isn\'t|aren\'t|wasn\'t|weren\'t)\b', text_lower))
        if negations > 0:
            # Swap positive and negative counts if there are negations
            # This is a very simplistic approach but works for basic cases
            if negations % 2 == 1:  # Odd number of negations
                positive_count, negative_count = negative_count, positive_count
        
        # Determine sentiment based on word counts
        if positive_count > negative_count:
            result = "positive"
        elif negative_count > positive_count:
            result = "negative"
        else:
            result = "neutral"
            
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return "neutral"  # Default to neutral on unexpected errors

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