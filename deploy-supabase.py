#!/usr/bin/env python3
"""
Supabase Deployment Script
Attempts to deploy via Supabase Management API
"""

import json
import os
import sys
import requests
from pathlib import Path

PROJECT_REF = "sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
SUPABASE_MGMT_API = "https://api.supabase.com/v1"

def read_sql_file():
    """Read migration SQL file"""
    sql_path = Path("backend/supabase/migrations/001_init_ready.sql")
    if sql_path.exists():
        return sql_path.read_text()
    return None

def read_function_code(func_name):
    """Read function code"""
    func_path = Path(f"backend/supabase/functions/{func_name}/index.ts")
    if func_path.exists():
        return func_path.read_text()
    return None

def main():
    print("🚀 Supabase Deployment Script")
    print(f"Project: {PROJECT_REF}")
    print("")
    
    # Check for access token
    access_token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    if not access_token:
        print("⚠️  SUPABASE_ACCESS_TOKEN not found")
        print("")
        print("To deploy automatically, set your access token:")
        print("  export SUPABASE_ACCESS_TOKEN='your-token'")
        print("")
        print("Get token from: https://supabase.com/dashboard/account/tokens")
        print("")
        print("📋 Manual deployment required:")
        print(f"  1. SQL: https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
        print(f"  2. Functions: https://supabase.com/dashboard/project/{PROJECT_REF}/functions")
        return
    
    print("✅ Access token found")
    print("")
    
    # Check SQL file
    sql_content = read_sql_file()
    if sql_content:
        print(f"✅ Migration file found ({len(sql_content)} chars)")
    else:
        print("⚠️  Migration file not found")
    
    # Check functions
    functions = [
        "openrouter-models",
        "openrouter-proxy",
        "validate-api-key",
        "run-handler",
        "task-executor",
        "github-pr",
        "sandbox-execute",
    ]
    
    print("")
    print("📋 Functions status:")
    for func in functions:
        code = read_function_code(func)
        if code:
            print(f"  ✅ {func} ({len(code)} chars)")
        else:
            print(f"  ⚠️  {func} not found")
    
    print("")
    print("📝 Note: Full deployment requires Supabase Dashboard")
    print("   See: دليل_النشر_الكامل.md")

if __name__ == "__main__":
    main()
