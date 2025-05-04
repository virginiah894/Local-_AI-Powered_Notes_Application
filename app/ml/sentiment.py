import logging
from textblob import TextBlob

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def analyze_sentiment(text: str) -> str:
    """
    Analyze the sentiment of the given text using TextBlob.
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
        
        # Create TextBlob object
        blob = TextBlob(text)
        
        # Get the polarity score (-1 to 1)
        polarity = blob.sentiment.polarity
        
        logger.debug(f"TextBlob polarity score: {polarity}")
        
        # Determine sentiment based on polarity
        if polarity > 0.1:
            result = "positive"
        elif polarity < -0.1:
            result = "negative"
        else:
            result = "neutral"
            
        logger.info(f"Sentiment analysis result: {result} (polarity: {polarity})")
        return result
        
    except Exception as e:
        logger.error(f"Unexpected error in sentiment analysis: {str(e)}")
        return "neutral"  # Default to neutral on unexpected errors