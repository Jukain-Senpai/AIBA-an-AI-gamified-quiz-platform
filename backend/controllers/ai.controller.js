const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateQuiz = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "AI features are not configured properly (missing API key)" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // We use gemini-2.0-flash as it's the standard for general, fast text tasks
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemInstruction = `
You are a helpful quiz generator. Based on the user's prompt, generate a quiz.
You MUST return ONLY valid JSON matching this exact structure, with no markdown formatting or backticks around it:
{
  "title": "string",
  "description": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "string",
  "questions": [
    {
      "text": "string (the question)",
      "answers": ["string", "string", "string", "string"],
      "correctIndex": number (0 to 3)
    }
  ]
}
Make sure each question has exactly 4 answers, and the correctIndex is correct.
        `;

        const finalPrompt = `${systemInstruction}\n\nUser prompt: ${prompt}`;

        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();
        
        // Clean up potential markdown formatting from the response
        let cleanedJson = responseText.trim();
        if (cleanedJson.startsWith('\`\`\`json')) {
            cleanedJson = cleanedJson.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
        } else if (cleanedJson.startsWith('\`\`\`')) {
            cleanedJson = cleanedJson.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
        }

        try {
            const quizData = JSON.parse(cleanedJson);
            
            // Basic validation
            if (!quizData.title || !Array.isArray(quizData.questions)) {
                throw new Error("Invalid format returned by AI");
            }
            
            res.status(200).json(quizData);
        } catch (parseError) {
            console.error("Failed to parse JSON from AI:", responseText);
            res.status(500).json({ message: "AI returned invalid format. Please try again." });
        }

    } catch (error) {
        console.error("AI Generation Error:", error);
        
        // Safety net for final year project presentation:
        // If the Gemini API fails (e.g. Quota limit = 0), return a perfectly formatted mock quiz
        // so the app doesn't crash during the demo.
        console.log("Using fallback mock quiz data due to API failure...");
        
        const mockQuiz = {
            title: "Demo Quiz: Introduction to Tech",
            description: "A fallback quiz generated because the AI API limit was reached. Test your basic tech knowledge!",
            difficulty: "Medium",
            category: "General",
            questions: [
                {
                    text: "What does HTML stand for?",
                    answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
                    correctIndex: 0
                },
                {
                    text: "Which of these is a JavaScript framework/library?",
                    answers: ["Django", "Vue.js", "Laravel", "Spring"],
                    correctIndex: 1
                },
                {
                    text: "What is the main purpose of CSS?",
                    answers: ["Database management", "Server-side logic", "Styling web pages", "Routing"],
                    correctIndex: 2
                }
            ]
        };

        return res.status(200).json(mockQuiz);
    }
};

module.exports = {
    generateQuiz
};
