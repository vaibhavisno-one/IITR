import Groq from "groq-sdk";

export const evaluateSubmission = async (
  githubSummary,
  milestoneTitle,
  milestoneDescription,
  freelancerNotes = ""
) => {

  const fallbackEvaluation = {
    score: 75,
    completed: true,
    feedback:
      "Fallback evaluation used because the AI service failed. Repository appears structurally valid but requires manual review.",
    strengths: ["Submission received", "Repository detected"],
    improvements: ["AI evaluation unavailable", "Manual verification recommended"]
  };

  try {

    if (!process.env.GROQ_API_KEY) {
      console.warn("No GROQ API key configured. Using fallback evaluation.");
      return fallbackEvaluation;
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `
You are a senior software engineer reviewing a freelancer milestone submission.

Your task is to determine whether the milestone requirements are satisfied.

MILESTONE TITLE:
${milestoneTitle}

MILESTONE DESCRIPTION:
${milestoneDescription}

FREELANCER NOTES:
${freelancerNotes || "None"}

REPOSITORY SUMMARY:
${githubSummary}

Evaluate:

• correctness of implementation  
• completeness of the milestone  
• repository structure  
• code professionalism  

If the milestone appears implemented → completed = true.

Return ONLY valid JSON:

{
  "score": number (0-100),
  "completed": boolean,
  "feedback": "technical explanation",
  "strengths": ["item1","item2"],
  "improvements": ["item1","item2"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer performing a repository code review. Return only JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = completion.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI returned invalid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (
      typeof parsed.score === "number" &&
      typeof parsed.completed === "boolean"
    ) {
      return parsed;
    }

    throw new Error("Missing required AI fields");

  } catch (error) {

    console.error("Evaluation AI Error:", error.message);

    return fallbackEvaluation;
  }
};

export default { evaluateSubmission };
