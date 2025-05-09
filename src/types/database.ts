export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  deadline: string;
  progress: number;
  category: string;
  status: 'progress' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface ProgressUpdate {
  id: string;
  goal_id: string;
  progress: number;
  note: string | null;
  created_at: string;
}