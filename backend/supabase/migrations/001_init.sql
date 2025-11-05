-- Supabase Database Schema for Capy-Inspired Platform
-- Run this migration in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  openrouter_api_key TEXT, -- Encrypted by Supabase Vault
  selected_model TEXT DEFAULT 'openai/gpt-4o',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Runs table (tasks)
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL,
  framework TEXT NOT NULL,
  complexity TEXT NOT NULL,
  model_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'error')),
  github_pr_url TEXT,
  github_pr_number INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Logs table (for real-time updates)
CREATE TABLE IF NOT EXISTS run_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  agent_name TEXT,
  log_level TEXT DEFAULT 'info' CHECK (log_level IN ('info', 'warning', 'error', 'success')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent status table
CREATE TABLE IF NOT EXISTS agent_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE NOT NULL,
  agent_name TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'completed', 'error')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(run_id, agent_name)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for runs
CREATE POLICY "Users can view own runs"
  ON runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own runs"
  ON runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runs"
  ON runs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for run_logs
CREATE POLICY "Users can view own run logs"
  ON run_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM runs
      WHERE runs.id = run_logs.run_id
      AND runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert logs"
  ON run_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for agent_status
CREATE POLICY "Users can view own agent status"
  ON agent_status FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM runs
      WHERE runs.id = agent_status.run_id
      AND runs.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can update agent status"
  ON agent_status FOR UPDATE
  WITH CHECK (true);

CREATE POLICY "Service role can insert agent status"
  ON agent_status FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_run_logs_run_id ON run_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_run_logs_created_at ON run_logs(run_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_status_run_id ON agent_status(run_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_runs_updated_at
  BEFORE UPDATE ON runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_status_updated_at
  BEFORE UPDATE ON agent_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for runs and logs
ALTER PUBLICATION supabase_realtime ADD TABLE runs;
ALTER PUBLICATION supabase_realtime ADD TABLE run_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_status;
