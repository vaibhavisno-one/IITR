import OpenAI from 'openai';

let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else if (process.env.GROK_API_KEY) {
    // GROK has OpenAI-compatible endpoints
    openai = new OpenAI({ 
        apiKey: process.env.GROK_API_KEY,
        baseURL: "https://api.x.ai/v1"
    });
}

const getAIResponse = async (prompt, systemPrompt) => {
    if (!openai) return null;
    try {
        const response = await openai.chat.completions.create({
            model: process.env.GROK_API_KEY ? "grok-preview" : "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error("AI Service Error:", error);
        return null;
    }
};

const generateMilestones = async (projectDetails) => {
    const { title, description, budget, deadline } = projectDetails;
    
    const systemPrompt = "You are an AI assistant that breaks down software projects into development milestones. You must output JSON containing an array of milestones under the key 'milestones'. Each milestone object must contain strictly these keys: 'title' (string), 'description' (string), 'percentageBudget' (number, sum of all must be 100), and 'days' (number of days to complete).";
    const prompt = `Project Title: ${title}\nDescription: ${description}\nTotal Budget: ${budget}\nDeadline: ${deadline}`;

    const apiResult = await getAIResponse(prompt, systemPrompt);
    
    if (apiResult && apiResult.milestones && Array.isArray(apiResult.milestones)) {
        return apiResult.milestones;
    }

    // Robust JSON Mock Fallback if no API key or failed parse
    return [
        { title: "Planning & Setup", description: "Initial setup, repo creation, and environment configuration.", percentageBudget: 20, days: 3 },
        { title: "Core Development", description: "Implementation of primary logic and features.", percentageBudget: 50, days: 10 },
        { title: "Testing & Deployment", description: "QA testing, bug fixing, and final deployment.", percentageBudget: 30, days: 4 }
    ];
};

const evaluateSubmission = async (submissionContent) => {
    const systemPrompt = "You are an AI code reviewer evaluating milestone submissions. You must output strictly JSON. The object must contain these keys: 'score' (number between 0 and 100), 'completed' (boolean indicating if it meets the core requirements), and 'feedback' (string detailing the code quality and correctness).";
    const prompt = `Evaluate the following submission to determine if the milestone is fully completed.\nSubmission Repo/Notes: ${submissionContent}`;

    const apiResult = await getAIResponse(prompt, systemPrompt);
    
    if (apiResult && typeof apiResult.score === 'number') {
        return {
            score: apiResult.score,
            completed: apiResult.completed,
            feedback: apiResult.feedback
        };
    }

    // Mock Fallback
    const mockScore = Math.floor(Math.random() * 30) + 70;
    return {
        score: mockScore,
        completed: mockScore >= 75,
        feedback: "This is a mock AI evaluation. The structured code looks good. Consider improving test coverage."
    };
};

export default {
    generateMilestones,
    evaluateSubmission
};