from textblob import TextBlob

def analyze_sentiment(text: str) -> str:
    """
    Analyze the sentiment of the given text using TextBlob.
    Returns 'positive', 'neutral', or 'negative'.
    """
    # Create TextBlob object
    blob = TextBlob(text)
    
    # Get the polarity score (-1 to 1)
    polarity = blob.sentiment.polarity
    
    # Determine sentiment based on polarity
    if polarity > 0.1:
        return "positive"
    elif polarity < -0.1:
        return "negative"
    else:
        return "neutral"