export async function fetchRepositorySummary(repoUrl) {

  try {

    const [owner, repo] = repoUrl
      .replace("https://github.com/", "")
      .split("/");

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return `
Repository: ${data.full_name}
Stars: ${data.stargazers_count}
Forks: ${data.forks_count}
Language: ${data.language}
Description: ${data.description}
`;

  } catch (error) {

    console.warn("GitHub fetch failed:", error.message);

    return "Repository metadata unavailable but submission accepted.";

  }
}
