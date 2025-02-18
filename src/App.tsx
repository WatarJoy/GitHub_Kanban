import React, { useState } from "react";
import { Box, Button, Input, Link, Flex, Text, HStack } from "@chakra-ui/react";
import { Toaster, toaster } from "./components/ui/toaster";
import { useBoardStore } from "./store";
import { Issue } from "./types/types";
import { fetchRepo, fetchRepoIssues } from "./utils/api";
import KanbanBoard from "./components/KanbanBoard";
import { FaStar } from "react-icons/fa";

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoKey, setRepoKey] = useState<string | null>(null);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const setBoard = useBoardStore((state) => state.setBoard);
  const [stars, setStars] = useState(0);

  const loadRepo = async () => {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      toaster.error({
        title: "Невірний URL",
        description: "Будь ласка, введіть валідний URL GitHub репозиторію.",
        type: "error",
      });
      return;
    }
    const [, owner, repoName] = match;
    setOwner(owner);
    const key = `${owner}/${repoName}`;
    setRepoKey(key);
    setLoading(true);
    try {
      const repo = await fetchRepo(owner, repoName);
      setStars(repo.stargazers_count);
    } catch (error) {
      console.error(error);
    }
    try {
      const issues: Issue[] = await fetchRepoIssues(owner, repoName);
      const todo = issues
        .filter((i) => i.state === "open" && !i.assignee)
        .map((i) => i.id);
      const inProgress = issues
        .filter((i) => i.state === "open" && i.assignee)
        .map((i) => i.id);
      const done = issues.filter((i) => i.state === "closed").map((i) => i.id);
      const existingBoard = useBoardStore.getState().boards[key];
      if (!existingBoard) {
        setBoard(key, {
          columns: { todo, inProgress, done },
          issues: issues.reduce((acc, issue) => {
            acc[issue.id] = issue;
            return acc;
          }, {} as { [id: number]: Issue }),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Flex mb={4}>
        <Input
          placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Button ml={2} onClick={loadRepo} loading={loading}>
          Load
        </Button>
      </Flex>
      {repoKey && (
        <Box mb={4}>
          <HStack gap={4}>
            <Link
              color="teal.500"
              href={`https://github.com/${owner}`}
              target="_blank"
              rel="noopener noreferrer"
              mr={4}
            >
              {owner}'s Profile
            </Link>
            <Link
              color="teal.500"
              href={`https://github.com/${repoKey}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repoKey} Repo
            </Link>
            <HStack>
              <FaStar color="gold" />
              <Text>
                {stars >= 1000
                  ? `${(stars / 1000).toFixed(1)}K stars`
                  : `${stars} stars`}
              </Text>
            </HStack>
          </HStack>
        </Box>
      )}
      {repoKey && <KanbanBoard repoKey={repoKey} />}
      <Toaster />
    </Box>
  );
};

export default App;
