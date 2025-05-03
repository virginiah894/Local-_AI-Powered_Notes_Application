import sys
import logging
from app.ml.sentiment import analyze_sentiment

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_sentiment_analysis():
    """Test the sentiment analysis function with various inputs."""
    test_cases = [
        {"text": "I love this product, it's amazing!", "expected": "positive"},
        {"text": "This is okay, nothing special.", "expected": "neutral"},
        {"text": "I hate this, it's terrible.", "expected": "negative"},
        {"text": "", "expected": "error or neutral"},  # Edge case: empty text
        {"text": "!@#$%^&*()", "expected": "error or neutral"},  # Edge case: non-text characters
        {"text": "a" * 10000, "expected": "any"}  # Performance test: long text
    ]
    
    logger.info("Starting sentiment analysis tests")
    
    for i, case in enumerate(test_cases):
        text = case["text"]
        expected = case["expected"]
        
        try:
            logger.info(f"Test case {i+1}: Analyzing text: '{text[:30]}...' (length: {len(text)})")
            
            import time
            start_time = time.time()
            result = analyze_sentiment(text)
            elapsed_time = time.time() - start_time
            
            logger.info(f"Result: '{result}', Expected: '{expected}', Time: {elapsed_time:.4f}s")
            
            if expected != "any" and result not in expected.split(" or "):
                logger.error(f"Test case {i+1} failed: Got '{result}' but expected '{expected}'")
            else:
                logger.info(f"Test case {i+1} passed")
                
        except Exception as e:
            logger.error(f"Test case {i+1} raised an exception: {str(e)}")
            
    logger.info("Sentiment analysis tests completed")

if __name__ == "__main__":
    test_sentiment_analysis()