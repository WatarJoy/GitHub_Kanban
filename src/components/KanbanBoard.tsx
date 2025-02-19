import React from "react";
import { Box, Heading, VStack, HStack } from "@chakra-ui/react";
import { useBoardStore } from "../store";
import IssueCard from "./IssueCard";
import { Board, Column } from "../types/types";
import { EmptyColumnDrop, BottomDropArea } from "./DropZones";

const columns: Column[] = ["todo", "inProgress", "done"];

const KanbanBoard: React.FC<{ repoKey: string }> = ({ repoKey }) => {
  const board: Board | undefined = useBoardStore(
    (state) => state.boards[repoKey]
  );
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const setIssue = useBoardStore((state) => state.setIssue);

  if (!board) return <Box>Loading board...</Box>;

  const moveCard = (column: Column, dragIndex: number, hoverIndex: number) => {
    const updatedOrder = Array.from(board.columns[column]);
    const [removed] = updatedOrder.splice(dragIndex, 1);
    updatedOrder.splice(hoverIndex, 0, removed);
    updateColumn(repoKey, column, updatedOrder);
  };

  const handleCrossDrop = (
    issueId: number,
    toColumn: Column,
    insertionIndex: number
  ) => {
    const fromColumn = (Object.keys(board.columns) as Column[]).find((col) =>
      board.columns[col].includes(issueId)
    );
    if (fromColumn && fromColumn !== toColumn) {
      const newSourceOrder = board.columns[fromColumn].filter(
        (id) => id !== issueId
      );
      const newTargetOrder = [...board.columns[toColumn]];
      newTargetOrder.splice(insertionIndex, 0, issueId);

      updateColumn(repoKey, fromColumn, newSourceOrder);
      updateColumn(repoKey, toColumn, newTargetOrder);

      const newState: "open" | "closed" =
        toColumn === "done" ? "closed" : "open";
      const updatedIssue = {
        ...board.issues[issueId],
        state: newState,
        assignee:
          toColumn === "inProgress" ? { login: "assigned-user" } : undefined,
      };

      setIssue(repoKey, issueId, updatedIssue);
    }
  };

  return (
    <HStack gap={4} align="start">
      {columns.map((col) => {
        const isEmpty = board.columns[col].length === 0;

        return (
          <Box key={col} p={4} bg="gray.muted" borderRadius="md" flex="1">
            <Heading as="h3" size="md" mb={2}>
              {col === "todo"
                ? "ToDo"
                : col === "inProgress"
                ? "In Progress"
                : "Done"}
            </Heading>
            <VStack
              gap={2}
              minHeight="100px"
              border="1px dashed"
              borderColor="gray.400"
              p={2}
            >
              {isEmpty ? (
                <EmptyColumnDrop
                  col={col}
                  board={board}
                  handleCrossDrop={handleCrossDrop}
                />
              ) : (
                <>
                  {board.columns[col].map((issueId, index) => (
                    <IssueCard
                      key={issueId}
                      issue={board.issues[issueId]}
                      index={index}
                      column={col}
                      moveCard={(dragIndex, hoverIndex, column) =>
                        moveCard(column, dragIndex, hoverIndex)
                      }
                      handleCrossDrop={handleCrossDrop}
                      repoKey={repoKey}
                    />
                  ))}
                  <BottomDropArea
                    col={col}
                    board={board}
                    moveCard={moveCard}
                    handleCrossDrop={handleCrossDrop}
                  />
                </>
              )}
            </VStack>
          </Box>
        );
      })}
    </HStack>
  );
};

export default KanbanBoard;
