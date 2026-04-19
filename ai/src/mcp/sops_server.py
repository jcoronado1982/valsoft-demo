from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("ai-worker-sops")

@mcp.tool()
async def get_sop(process_name: str) -> str:
    """
    Retrieve the Standard Operating Procedure (SOP) for a specific project process.
    Reads live documentation from the monorepo's Markdown files.
    
    Args:
        process_name: one of ['frontend', 'backend', 'ai_worker', 'security', 'database_search', 'governance', 'infrastructure'].
    """
    import os
    
    # Map friendly names to file paths
    sop_map = {
        "frontend": "frontend/standard-operating-procedure.md",
        "backend": "backend/standard-operating-procedure.md",
        "ai_worker": "ai/standard-operating-procedure.md",
        "security": "docs/SECURITY_SOP.md",
        "database_search": "docs/DATABASE_SEARCH_SOP.md",
        "governance": "infra/GOVERNANCE.md",
        "infrastructure": "infra/INFRASTRUCTURE_SOP.md"
    }
    
    file_rel_path = sop_map.get(process_name.lower())
    if not file_rel_path:
        return f"SOP for '{process_name}' not found. Available: {list(sop_map.keys())}"
    
    # Assume we are running from the monorepo root or have a way to reach it
    # FastMCP usually runs in a context where relative paths might need resolving
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    full_path = os.path.join(base_path, file_rel_path)
    
    try:
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                return f.read()
        return f"Error: File {file_rel_path} not found at {full_path}"
    except Exception as e:
        return f"Error reading SOP: {str(e)}"

@mcp.tool()
async def search_inventory(term: str) -> str:
    """
    Search the inventory for products using full-text search or fuzziness.
    
    Args:
        term: The search string (e.g., product name or attributes).
    """
    import httpx
    import os
    
    backend_url = os.getenv("SERVICES__BACKEND__HTTP__0", "http://localhost:5039")
    url = f"{backend_url}/api/items"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params={"term": term}, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return f"Search results for '{term}': {data}"
        except Exception as e:
            return f"Error searching inventory: {str(e)}"

@mcp.tool()
async def add_inventory_item(name: str, price: float, quantity: int, category_id: int = 1) -> str:
    """
    Add a new item to the inventory system.
    
    Args:
        name: The human-readable name of the product.
        price: The unit price of the item in USD.
        quantity: The initial stock level.
        category_id: The ID of the category (default is 1 for 'General').
    """
    import httpx
    import os
    
    # In Aspire, environment variables like SERVICES__BACKEND__HTTP__0 define service URLs
    backend_url = os.getenv("SERVICES__BACKEND__HTTP__0", "http://localhost:5039")
    url = f"{backend_url}/api/items"
    
    payload = {
        "name": name,
        "price": price,
        "quantity": quantity,
        "categoryId": category_id
    }
    
    async with httpx.AsyncClient() as client:
        try:
            # We assume internal communication or provided token in production
            response = await client.post(url, json=payload, timeout=10.0)
            response.raise_for_status()
            add_data = response.json()
            
            # Post-creation context enrichment: Search for what was just added
            search_response = await client.get(url, params={"term": name}, timeout=5.0)
            search_context = ""
            if search_response.status_code == 200:
                 search_data = search_response.json()
                 search_context = f"\nPost-Creation Search Verification Context:\n{search_data}"
                 
            return f"Successfully added item: {name} (ID: {add_data.get('id')}). {search_context}"
        except Exception as e:
            return f"Error adding item to inventory: {str(e)}"

@mcp.prompt()
async def analyze_invoice(invoice_data: str) -> str:
    """Prompt for analyzing invoice data based on current standards."""
    return f"Please analyze this invoice data following 2026 standards: {invoice_data}"

if __name__ == "__main__":
    mcp.run()


