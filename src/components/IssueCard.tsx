import React, { useRef } from "react";
import { Box, Link, Text } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";
import { Issue, Column } from "../types/types";
import { formatDistance, subDays } from "date-fns";

type IssueCardProps = {
  issue: Issue;
  index: number;
  column: Column;
  moveCard: (dragIndex: number, hoverIndex: number, column: Column) => void;
  handleCrossDrop: (
    issueId: number,
    toColumn: Column,
    insertionIndex: number
  ) => void;
  repoKey: string;
};

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  index,
  column,
  moveCard,
  handleCrossDrop,
  repoKey,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "ISSUE_CARD",
    item: { id: issue.id, index, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "ISSUE_CARD",
    drop(item: { id: number; index: number; column: Column }, monitor) {
      if (item.column !== column) {
        if (!ref.current) return;
        const hoverRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientY = clientOffset.y - hoverRect.top;
        const targetIndex = hoverClientY < hoverMiddleY ? index : index + 1;
        handleCrossDrop(item.id, column, targetIndex);
      }
      return;
    },
    hover(item: { id: number; index: number; column: Column }, monitor) {
      if (item.column !== column) return;
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex, column);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const style = {
    opacity: isDragging ? 0.5 : 1,
    padding: "8px",
    border: "2px solid #929292",
    borderRadius: "10px",
    backgroundColor: "lightgrey",
    width: "100%",
    cursor: "move",
    marginBottom: "4px",
  };

  return (
    <Box ref={ref} style={style}>
      <Link
        href={`https://github.com/${repoKey}/issues/${issue.number}`}
        target="_blank"
        fontWeight="bold"
        color="black"
      >
        {issue.title}
      </Link>
      <Text color="#252525">
        #{issue.number} Opened{" "}
        {formatDistance(subDays(new Date(), 3), issue.created_at)} ago
      </Text>
      <Text>
        <Link
          href={`https://github.com/${issue.user.login}`}
          target="_blank"
          color="#5a00bf"
        >
          {issue.user.login === "assigned-user"
            ? "User not assigned yet"
            : issue.user.login}
        </Link>
        {" | "}
        <Text as="span" color="black">
          Comments: {issue.comments}
        </Text>
      </Text>
    </Box>
  );
};

export default IssueCard;
