import pytest
import sys

if __name__ == "__main__":
    # Run tests and capture the exit code
    exit_code = pytest.main(["tests/"])
    
    # Exit with the same code
    sys.exit(exit_code)