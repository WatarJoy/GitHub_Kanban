import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Issue, Column } from "./types/types";

export interface BoardData {
  columns: {
    todo: number[];
    inProgress: number[];
    done: number[];
  };
  issues: { [id: number]: Issue };
}

export interface BoardState {
  boards: {
    [repo: string]: {
      columns: {
        todo: number[];
        inProgress: number[];
        done: number[];
      };
      issues: { [id: number]: Issue };
    };
  };
  setBoard: (repo: string, boardData: BoardData) => void;
  updateColumn: (repo: string, column: Column, newOrder: number[]) => void;
  setIssue: (repo: string, issueId: number, updatedIssue: Issue) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: {},
      setBoard: (repo, boardData) =>
        set((state) => ({
          boards: { ...state.boards, [repo]: boardData },
        })),
      updateColumn: (repo, column, newOrder) =>
        set((state) => {
          const board = state.boards[repo];
          if (!board) return {};
          return {
            boards: {
              ...state.boards,
              [repo]: {
                ...board,
                columns: { ...board.columns, [column]: newOrder },
              },
            },
          };
        }),
      setIssue: (repo, issueId, updatedIssue) =>
        set((state) => {
          const board = state.boards[repo];
          if (!board) return {};
          return {
            boards: {
              ...state.boards,
              [repo]: {
                ...board,
                issues: { ...board.issues, [issueId]: updatedIssue },
              },
            },
          };
        }),
    }),
    {
      name: "kanban-board-storage",
    }
  )
);
