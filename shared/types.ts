export enum TaskStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export type Task = {
  id: string;
  title: string;
  content?: string;
  status: TaskStatus;
  labels: Array<{ id: string; title: string; color: string }>;
  reminders: Array<{
    id: string;
    datetime: string;
    repeat: number;
    interval: number;
  }>;
};

export type APIResponse<T> = {
  meta: object;
  data: T;
};
