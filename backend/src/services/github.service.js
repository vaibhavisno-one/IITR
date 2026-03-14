export async function fetchRepositorySummary(repoUrl) {
  try {

    if (!repoUrl || !repoUrl.includes("github.com")) {
      return {
        valid: false,
        message: "Invalid GitHub repository URL"
      };
    }

    const parts = repoUrl.replace("https://github.com/", "").split("/");
    const owner = parts[0];
    const repo = parts[1];

    if (!owner || !repo) {
      return {
        valid: false,
        message: "Invalid repository format"
      };
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      return {
        valid: false,
        message: `GitHub API error ${response.status}`
      };
    }

    const data = await response.json();

    return {
      valid: true,
      summary: {
        name: data.full_name,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        description: data.description
      }
    };

  } catch (error) {

    return {
      valid: false,
      message: error.message || "GitHub request failed"
    };

  }
}
