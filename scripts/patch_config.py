import json
import os
import sys

def patch_appsettings(file_path):
    if not os.path.exists(file_path):
        print(f'Warning: {file_path} not found.')
        return
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # 1. Fix Database Connection String
    if 'ConnectionStrings' in data and 'inventorydb' in data['ConnectionStrings']:
        cs = data['ConnectionStrings']['inventorydb']
        # Replace stale IP with localhost
        if '172.20.0.2' in cs:
            data['ConnectionStrings']['inventorydb'] = cs.replace('172.20.0.2', 'localhost')
            print(f'Patched DB Host in {file_path}')
        # Ensure correct password
        if 'valsoft2026!' in cs:
            data['ConnectionStrings']['inventorydb'] = data['ConnectionStrings']['inventorydb'].replace('valsoft2026!', 'password')
            print(f'Patched DB Password in {file_path}')

    # 2. Fix AI gRPC Endpoint
    if 'services' not in data:
        data['services'] = {}
    if 'ai' not in data['services']:
        data['services']['ai'] = {}
    if 'grpc' not in data['services']['ai']:
        data['services']['ai']['grpc'] = {}
    
    data['services']['ai']['grpc']['0'] = 'http://127.0.0.1:50851'
    print(f'Ensured AI gRPC endpoint in {file_path}')
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    # Local path alignment
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.abspath(os.path.join(script_dir, '..', 'backend', 'Inventory.API'))
    
    patch_appsettings(os.path.join(base_dir, 'appsettings.json'))
    patch_appsettings(os.path.join(base_dir, 'appsettings.Production.json'))
