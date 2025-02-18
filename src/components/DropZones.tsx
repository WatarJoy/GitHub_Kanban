// DropZones.tsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { Column } from "../types/types";
import { Board, DragItem } from "../types/types";

interface EmptyColumnDropProps {
  col: Column;
  board: Board;
  handleCrossDrop: (
    issueId: number,
    toColumn: Column,
    insertionIndex: number
  ) => void;
}

export const EmptyColumnDrop: React.FC<EmptyColumnDropProps> = ({
  col,
  handleCrossDrop,
}) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "ISSUE_CARD",
    drop: (item) => {
      if (item.column !== col) {
        handleCrossDrop(item.id, col, 0);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      w="100%"
      h="300px"
      textAlign="center"
      opacity={isOver ? 0.7 : 0.5}
    >
      Перетягніть завдання сюди
    </Box>
  );
};

interface BottomDropAreaProps {
  col: Column;
  board: Board;
  moveCard: (column: Column, dragIndex: number, hoverIndex: number) => void;
  handleCrossDrop: (
    issueId: number,
    toColumn: Column,
    insertionIndex: number
  ) => void;
}

export const BottomDropArea: React.FC<BottomDropAreaProps> = ({
  col,
  board,
  moveCard,
  handleCrossDrop,
}) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "ISSUE_CARD",
    drop: (item) => {
      console.log("Drop in BottomDropArea:", {
        item,
        target: board.columns[col].length,
      });
      if (item.column !== col) {
        handleCrossDrop(item.id, col, board.columns[col].length);
      } else {
        moveCard(col, item.index, board.columns[col].length);
        // Оновлюємо індекс елемента після переміщення
        item.index = board.columns[col].length - 1;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      width="100%"
      height="40px" // збільшена висота для зручності drop
      bg={isOver ? "gray.100" : "transparent"}
    />
  );
};
