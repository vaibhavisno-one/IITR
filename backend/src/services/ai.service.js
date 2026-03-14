import Groq from "groq-sdk";

export const generateMilestones = async (project) => {
    const fallbackMilestones = [
        { title: "Project Setup", description: "Initial setup, framework installation, and basic configuration.", percentageBudget: 20, estimatedDays: 3, days: 3 },
        { title: "Core Development", description: "Implementation of the primary logic, routing, and integrated database models.", percentageBudget: 50, estimatedDays: 10, days: 10 },
        { title: "Testing and Deployment", description: "Writing unit tests, performing QA checks, and final server deployment.", percentageBudget: 30, estimatedDays: 4, days: 4 }
    ];

    try {
        if (!process.env.GROQ_API_KEY) {
            console.warn("No GROQ API key configured. Using fallback milestones.");
            return fallbackMilestones;
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const prompt = `You are a technical project manager. Generate development milestones for this project.

Write natural language milestones where each milestone represents a real engineering step including development, integration, and testing tasks.

Project Title: ${project.title}
Project Description: ${project.description}
Budget: ${project.budget}
Deadline: ${project.deadline}

Return strictly valid JSON containing an array of milestones.
Each milestone must contain exactly these keys:
{
  "title": "Milestone title",
  "description": "Detailed natural language explanation",
  "percentageBudget": number,
  "estimatedDays": number
}

The sum of percentageBudget across all milestones must be exactly 100.
Do not wrap in markdown or any other text. Output exactly the raw JSON array. Example:
[
  {
    "title": "Backend API Development",
    "description": "Design and implement the backend API endpoints, database schema, and authentication system required for the project.",
    "percentageBudget": 30,
    "estimatedDays": 3
  }
]`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a technical project manager. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.2
        });

        const responseContent = completion.choices[0]?.message?.content || "";
        const jsonMatch = responseContent.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Ensure compatibility with existing controller by copying estimatedDays to days
                return parsed.map(m => ({
                    ...m,
                    days: m.estimatedDays || m.days || 7
                }));
            }
        }
        
        throw new Error("Invalid JSON structure from AI. Check the response format.");
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        return fallbackMilestones;
    }
};

export default { generateMilestones };
