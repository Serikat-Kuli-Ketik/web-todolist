export type Task = {
  id: string;
  title: string;
  content?: string;
  labels: Array<{ id: string; title: string; color: string }>;
  reminders: Array<{
    id: string;
    datetime: string;
    repeat: number;
    interval: number;
  }>;
};
