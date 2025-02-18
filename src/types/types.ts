export type Column = "todo" | "inProgress" | "done";

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  assignee?: {
    login: string;
  };
  created_at: Date;
  user: {
    login: string;
  };
  comments: number;
}

export interface Board {
  columns: Record<Column, number[]>;
  issues: Record<number, Issue>;
}

export interface DragItem {
  id: number;
  index: number;
  column: Column;
}
