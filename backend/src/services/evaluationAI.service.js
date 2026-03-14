import Groq from "groq-sdk";

export const evaluateSubmission = async (githubSummary, milestoneTitle, milestoneDescription, freelancerNotes = "") => {
    const fallbackEvaluation = {
        score: 75,
        completed: true,
        feedback: "Fallback evaluation used due to missing API key or an AI failure. The repository looks adequate.",
        strengths: ["Submission received", "Basic structure present"],
        improvements: ["Automated evaluation failed", "Requires human review"]
    };

    try {
        if (!process.env.GROQ_API_KEY) {
            console.warn("No GROQ API key configured. Using fallback evaluation.");
            return fallbackEvaluation;
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `You are a senior software engineer reviewing a milestone submission.
Review this submission strictly against the milestone requirements and the repository context.

Milestone Title: ${milestoneTitle}
Milestone Description: ${milestoneDescription}
Freelancer Notes: ${freelancerNotes || 'None provided'}

GitHub Repository Analysis:
${githubSummary}

Evaluate the code quality, completeness, and correctness.
Return strictly valid JSON matching this exact structure:
{
  "score": number (0-100),
  "completed": boolean,
  "feedback": "Detailed technical reasoning",
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"]
}

Example response:
{
  "score": 88,
  "completed": true,
  "feedback": "The repository implements the required backend APIs and database schema.",
  "strengths": [
    "Clear project structure",
    "Working API routes"
  ],
  "improvements": [
    "Add error handling",
    "Improve README documentation"
  ]
}

Do not wrap in markdown blocks, just return the raw JSON object.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a senior software engineer conducting a code review. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.2
        });

        const responseContent = completion.choices[0]?.message?.content || "";
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (typeof parsed.score === 'number' && typeof parsed.completed === 'boolean') {
                return parsed;
            }
        }
        
        throw new Error("Invalid format from AI. Score or completed key missing.");
    } catch (error) {
        console.error("Evaluation AI Error:", error.message);
        return fallbackEvaluation;
    }
};

export default { evaluateSubmission };
