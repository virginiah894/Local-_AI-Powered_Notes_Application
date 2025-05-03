import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Simple word lists for sentiment analysis
POSITIVE_WORDS = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'terrific', 'outstanding', 'superb', 'brilliant', 'awesome', 'love',
    'happy', 'joy', 'pleased', 'delighted', 'satisfied', 'impressive',
]

NEGATIVE_WORDS = [
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing',
    'hate', 'dislike', 'angry', 'sad', 'upset', 'annoying', 'frustrating',
    'mediocre', 'inferior', 'worst', 'failure', 'problem', 'issue','badly',
    'unpleasant', 'dissatisfied', 'unhappy', 'displeased', 'irritating',
    'unacceptable', 'unfortunate', 'regrettable', 'distressing', 'troublesome',
    'unfavorable', 'unreliable', 'inadequate', 'subpar', 'inferior',
    'untrustworthy', 'unpleasant', 'unwelcome', 'unwanted', 'undesirable','bad'
]

def analyze_sentiment(text: str) -> str:
    """
    Analyze the sentiment of the given text using a simple rule-based approach.
    Returns 'positive', 'neutral', or 'negative'.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        str: The sentiment classification ('positive', 'neutral', or 'negative')
    """
    # Input validation
    if not text or not isinstance(text, str):
        logger.warning(f"Invalid input text: {text}")
        return "neutral"  # Default to neutral for invalid input
        
    if len(text.strip()) == 0:
        logger.warning("Empty text provided for sentiment analysis")
        return "neutral"  # Default to neutral for empty text
    
    try:
        # Log the text being analyzed (truncated for privacy/brevity)
        truncated = text[:50] + "..." if len(text) > 50 else text
        logger.debug(f"Analyzing sentiment for text: '{truncated}'")
        
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
        
        logger.debug(f"Positive words: {positive_count}, Negative words: {negative_count}")
        
        # Determine sentiment based on word counts
        if positive_count > negative_count:
            result = "positive"
        elif negative_count > positive_count:
            result = "negative"
        else:
            result = "neutral"
            
        logger.info(f"Sentiment analysis result: {result} (positive: {positive_count}, negative: {negative_count})")
        return result
        
    except Exception as e:
        logger.error(f"Unexpected error in sentiment analysis: {str(e)}")
        return "neutral"  # Default to neutral on unexpected errors