const evaluateSubmission = async (submissionContent) => {
    // Mock AI evaluation - will be replaced with actual LLM call
    const mockScore = Math.floor(Math.random() * 30) + 70
    
    return {
        score: mockScore,
        feedback: "This is a mock AI evaluation. The submission appears to meet the basic requirements. Consider improving documentation and code structure."
    }
}

const generateFeedback = async (submissionContent, milestoneDescription) => {
    // Mock feedback generation - will be replaced with actual LLM call
    return {
        feedback: "Mock AI feedback: Good work overall. Focus on improving clarity and attention to detail.",
        suggestions: [
            "Add more detailed comments",
            "Consider edge cases",
            "Improve error handling"
        ]
    }
}

export default {
    evaluateSubmission,
    generateFeedback
}