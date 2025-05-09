/*
  # Goals and User Management Schema

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `deadline` (date)
      - `progress` (integer)
      - `category` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `milestones`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `title` (text)
      - `completed` (boolean)
      - `created_at` (timestamptz)

    - `progress_updates`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `progress` (integer)
      - `note` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  deadline date NOT NULL,
  progress integer DEFAULT 0,
  category text NOT NULL,
  status text DEFAULT 'progress' CHECK (status IN ('progress', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Progress updates table
CREATE TABLE IF NOT EXISTS progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals ON DELETE CASCADE NOT NULL,
  progress integer NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;

-- Policies for goals
CREATE POLICY "Users can create their own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for milestones
CREATE POLICY "Users can manage milestones for their goals"
  ON milestones FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  ));

-- Policies for progress updates
CREATE POLICY "Users can manage progress updates for their goals"
  ON progress_updates FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = progress_updates.goal_id
    AND goals.user_id = auth.uid()
  ));