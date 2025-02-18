export async function fetchRepoIssues(owner: string, repoName: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/issues`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }
  return response.json();
}

export async function fetchRepo(owner: string, repoName: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }
  return response.json();
}
