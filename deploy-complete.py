#!/usr/bin/env python3
"""
Complete Supabase Deployment via Management API
"""
import json
import os
import sys
import subprocess
from pathlib import Path

PROJECT_REF = "sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc"
ACCESS_TOKEN = "8O15C3CS7SkYAD8DjYH7v04VgEB68cv8rBgnqxQA"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"

def read_file(path):
    """Read file content"""
    p = Path(path)
    if p.exists():
        return p.read_text()
    return None

def deploy_sql_via_api():
    """Try to deploy SQL via API"""
    sql_content = read_file("backend/supabase/migrations/001_init_ready.sql")
    if not sql_content:
        print("⚠️  SQL file not found")
        return False
    
    print("📊 SQL Migration ready:")
    print(f"   {len(sql_content)} characters")
    print("   ⚠️  Must be deployed manually via Dashboard")
    print("   https://supabase.com/dashboard/project/{}/sql/new".format(PROJECT_REF))
    return False

def deploy_functions_via_cli():
    """Deploy functions using Supabase CLI"""
    functions = [
        "openrouter-models",
        "openrouter-proxy", 
        "validate-api-key",
        "run-handler",
        "task-executor",
        "github-pr",
        "sandbox-execute",
    ]
    
    print("⚡ Deploying Edge Functions...")
    print("")
    
    # Try using access token with different methods
    env = os.environ.copy()
    env["SUPABASE_ACCESS_TOKEN"] = ACCESS_TOKEN
    
    # Try setting project ref in config
    config_path = Path("backend/supabase/config.toml")
    if config_path.exists():
        print("✅ Config file found")
    
    deployed = []
    failed = []
    
    for func in functions:
        func_path = Path(f"backend/supabase/functions/{func}")
        if not func_path.exists():
            print(f"⚠️  {func}: Directory not found")
            failed.append(func)
            continue
        
        print(f"→ Deploying {func}...")
        
        # Try deployment
        try:
            # Use npx supabase with access token
            result = subprocess.run(
                ["npx", "supabase", "functions", "deploy", func, "--project-ref", PROJECT_REF],
                env=env,
                cwd="backend/supabase",
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print(f"   ✅ {func} deployed successfully")
                deployed.append(func)
            else:
                print(f"   ⚠️  {func} failed: {result.stderr[:100]}")
                failed.append(func)
        except Exception as e:
            print(f"   ⚠️  {func} error: {str(e)[:100]}")
            failed.append(func)
    
    print("")
    print("📋 Deployment Summary:")
    print(f"   ✅ Deployed: {len(deployed)}")
    print(f"   ⚠️  Failed: {len(failed)}")
    
    if failed:
        print("")
        print("⚠️  Manual deployment required for:")
        for func in failed:
            print(f"   - {func}")
        print("")
        print("   Via Dashboard:")
        print(f"   https://supabase.com/dashboard/project/{PROJECT_REF}/functions")
    
    return len(deployed) > 0

def main():
    print("🚀 Complete Supabase Deployment")
    print(f"Project: {PROJECT_REF}")
    print("")
    
    # Try SQL deployment
    deploy_sql_via_api()
    print("")
    
    # Try functions deployment
    deploy_functions_via_cli()
    
    print("")
    print("📋 Next Steps:")
    print("1. Deploy SQL migration via Dashboard")
    print("2. Set environment variables for functions")
    print("3. Test deployed functions")

if __name__ == "__main__":
    main()
