import openpyxl
import psycopg2
from psycopg2.extras import execute_values
import os

# Database connection details (fetching from env)
DB_PARAMS = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'database': os.getenv('DB_NAME', 'inventory_db'),
    'user': os.getenv('DB_USER', 'user'),
    'password': os.getenv('DB_PASSWORD', 'password')
}

EXCEL_FILE = 'upload/revision.xlsx'

def import_data():
    if not os.path.exists(EXCEL_FILE):
        print(f"Error: {EXCEL_FILE} not found")
        return

    print(f"Reading {EXCEL_FILE}...")
    wb = openpyxl.load_workbook(EXCEL_FILE, data_only=True)
    ws = wb.active
    
    rows = []

    # Skip header
    for row in ws.iter_rows(min_row=2, values_only=True):
        # We need 16 columns matching the table fields
        # Excel columns: NIT, Fecha de Corte, Utilidad Neta, Razón social, Objeto, Industria, constitucion, estatus, tipo, DIRECCION, ESTADO, CIUDAD, telefono, celular, email, matricula
        rows.append(tuple(str(val) if val is not None else None for val in row[:16]))

    print(f"Connecting to database...")
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()

    # Clear existing data
    print("Clearing existing companies...")
    cur.execute('TRUNCATE TABLE companies RESTART IDENTITY;')

    insert_query = """
        INSERT INTO companies (
            nit, fecha_de_corte, utilidad_neta, razon_social, objeto, 
            industria, constitucion, estatus, tipo, direccion, 
            estado, ciudad, telefono, celular, email, matricula
        ) VALUES %s
    """

    print(f"Inserting {len(rows)} records in batches of 500...")
    batch_size = 500
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        print(f"  Inserting block {i//batch_size + 1} ({len(batch)} records)...")
        execute_values(cur, insert_query, batch)
        conn.commit()
    
    cur.close()
    conn.close()
    print("Import complete!")

if __name__ == "__main__":
    import_data()
