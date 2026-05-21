-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- We use text to support either Firebase UIDs or Supabase UUIDs
  email TEXT,
  displayName TEXT,
  photoURL TEXT,
  language TEXT DEFAULT 'pt',
  theme TEXT DEFAULT 'dark',
  specialization TEXT,
  trialStartDate TIMESTAMPTZ DEFAULT NOW(),
  subscriptionStatus TEXT DEFAULT 'trial',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notes table (formerly users/{uid}/notes)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  priority BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table (for Chatbot)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'model')),
  text TEXT,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- For dynamic user tables requested previously
CREATE TABLE IF NOT EXISTS user_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schema JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS table_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES user_tables(id) ON DELETE CASCADE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- To support `entries` from `supabase-utils.ts`
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  type TEXT DEFAULT 'note',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Turn on Row Level Security (RLS)
-- Note: In a pure Supabase setup, row level policies ensure safety. 
-- Since we may be bridging Firebase or public anon keys, we either disable RLS or set liberal rules.
-- For strict security (if using Supabase Auth natively):
/*
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own data" ON users USING (auth.uid()::text = id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON notes USING (auth.uid()::text = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own messages" ON messages USING (auth.uid()::text = user_id);
*/
