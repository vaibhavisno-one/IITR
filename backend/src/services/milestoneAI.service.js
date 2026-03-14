import OpenAI from 'openai';

const getAIResponse = async (prompt, systemPrompt) => {
    let openai = null;
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else if (process.env.GROK_API_KEY) {
        openai = new OpenAI({ 
            apiKey: process.env.GROK_API_KEY,
            baseURL: "https://api.x.ai/v1"
        });
    }

    if (!openai) {
        throw new Error("No OpenAI or Grok API Key configured.");
    }
    const response = await openai.chat.completions.create({
        model: process.env.GROK_API_KEY ? "grok-preview" : "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
};

export const generateMilestones = async (projectDetails) => {
    const { title, description, budget, deadline } = projectDetails;
    
    const systemPrompt = "You are an AI assistant that breaks down software projects into development milestones. You must output JSON containing an array of milestones under the key 'milestones'. Each milestone object must contain strictly these keys: 'title' (string), 'description' (string), 'percentageBudget' (number, sum of all must be 100), and 'days' (number of days to complete).";
    const prompt = `Project Title: ${title}\nDescription: ${description}\nTotal Budget: ${budget}\nDeadline: ${deadline}`;

    const apiResult = await getAIResponse(prompt, systemPrompt);
    
    if (!apiResult || !apiResult.milestones || !Array.isArray(apiResult.milestones)) {
        throw new Error("AI failed to generate valid milestones format.");
    }

    return apiResult.milestones;
};

export default {
    generateMilestones
};
