
export interface ITask {
  name: string;
  description: string;
  user_id: string;
  start_time: number;
  duration: number;
  is_solved: boolean;
  notification_id: number;
  created_at: number;
}
