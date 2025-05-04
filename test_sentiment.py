import sys
import os

# Add the app directory to the path so we can import the modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ml.sentiment import analyze_sentiment

def test_sentiment_analysis():
    """
    Test the TextBlob sentiment analysis implementation.
    """
    print("Testing TextBlob sentiment analysis...")
    
    # Test positive sentiment
    positive_texts = [
        "I love this product, it's amazing!",
        "The service was excellent and the staff were very helpful.",
        "This is the best experience I've ever had.",
        "I'm extremely satisfied with the quality of this item."
    ]
    
    # Test negative sentiment
    negative_texts = [
        "This is terrible, I hate it.",
        "The worst experience of my life, very disappointing.",
        "Poor quality and bad customer service.",
        "I regret buying this product, it's awful."
    ]
    
    # Test neutral sentiment
    neutral_texts = [
        "The product arrived today.",
        "It is what it is.",
        "I received the package yesterday.",
        "The color is blue."
    ]
    
    print("\nPositive texts:")
    for text in positive_texts:
        sentiment = analyze_sentiment(text)
        print(f"Text: '{text}'\nSentiment: {sentiment}\n")
    
    print("\nNegative texts:")
    for text in negative_texts:
        sentiment = analyze_sentiment(text)
        print(f"Text: '{text}'\nSentiment: {sentiment}\n")
    
    print("\nNeutral texts:")
    for text in neutral_texts:
        sentiment = analyze_sentiment(text)
        print(f"Text: '{text}'\nSentiment: {sentiment}\n")

if __name__ == "__main__":
    test_sentiment_analysis()