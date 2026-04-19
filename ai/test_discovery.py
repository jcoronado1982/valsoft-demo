import os
import sys
import json
from dotenv import load_dotenv

# Add src to path for engine import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from core.engine import ResearchAgent

# Load environment variables
load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def main():
    if not TAVILY_API_KEY or not GEMINI_API_KEY:
        print("❌ Error: TAVILY_API_KEY and GEMINI_API_KEY must be set in .env")
        return

    print("🚀 Starting Company Discovery Test...")
    print(f"📍 Country: Colombia")
    print(f"🔢 Limit: 10")
    
    try:
        agent = ResearchAgent(TAVILY_API_KEY, GEMINI_API_KEY)
        result = agent.discover_companies("Colombia", 10)
        
        print("\n" + "="*60)
        print(f"✅ Discovery Result Summary")
        print(f"Total Found: {result['total_found']}")
        print(f"Search Source: {result['search_source']}")
        print("="*60)
        
        for i, comp in enumerate(result['companies'], 1):
            print(f"\n[{i}] {comp['legal_name']}")
            print(f"    Commercial: {comp['commercial_name']}")
            print(f"    Foundation Date: {comp['foundation_date']}")
            print(f"    Legal Rep: {comp['legal_representative']}")
            print(f"    Phones: {comp['phones']}")
            print(f"    Email: {comp['official_email']}")
            print(f"    Sector: {comp.get('sector', 'N/A')}")
            print(f"    Chamber of Commerce Status: {comp.get('chamber_of_commerce_status', 'N/A')}")
            print(f"    Status: {comp['registration_status']}")
            print(f"    Source: {comp['official_data_source']}")
            
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    main()
