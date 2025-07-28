import { RequestHandler } from "express";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  user_id: string;
  messages: Message[];
}

// Dummy AI responses for different types of questions
const generateAIResponse = (userMessage: string, userId: string): { reply: string, followUpQuestions: string[] } => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('maintenance') || message.includes('service')) {
    return {
      reply: `For your vehicles, I recommend checking the maintenance schedule in your owner's manual. Generally, oil changes are needed every 5,000-7,500 miles, and major services every 30,000-60,000 miles. Would you like specific recommendations for any of your vehicles?`,
      followUpQuestions: [
        "What's the maintenance schedule for my Toyota Camry?",
        "When should I change my oil?",
        "How often should I check tire pressure?",
        "What are signs I need brake service?"
      ]
    };
  }

  if (message.includes('fuel') || message.includes('gas') || message.includes('mileage')) {
    return {
      reply: `To improve fuel efficiency:\n\n- **Regular maintenance**: Keep your engine tuned\n- **Tire pressure**: Check monthly for optimal pressure\n- **Driving habits**: Avoid rapid acceleration and hard braking\n- **Air filter**: Replace when dirty\n\nWhich vehicle would you like specific advice for?`,
      followUpQuestions: [
        "How can I improve my highway fuel efficiency?",
        "What's the best driving speed for fuel economy?",
        "Should I use premium gas?",
        "How does tire pressure affect fuel consumption?"
      ]
    };
  }

  if (message.includes('problem') || message.includes('issue') || message.includes('trouble')) {
    return {
      reply: `I'd be happy to help diagnose vehicle issues! Can you provide more details about:\n\n- Which vehicle is having the problem?\n- What symptoms are you experiencing?\n- When did the issue start?\n- Any warning lights on the dashboard?`,
      followUpQuestions: [
        "My car is making strange noises",
        "The engine won't start",
        "I have a warning light on my dashboard",
        "My car is vibrating while driving"
      ]
    };
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return {
      reply: `Hello! I'm ORIN AI, your vehicle assistant. I can help you with:\n\n🔧 **Maintenance schedules**\n⛽ **Fuel efficiency tips**\n🚗 **Troubleshooting issues**\n📋 **Vehicle recommendations**\n\nWhat would you like to know about your vehicles?`,
      followUpQuestions: [
        "What maintenance does my car need?",
        "How can I improve fuel efficiency?",
        "My car has a problem, can you help?",
        "What's the best oil for my vehicle?"
      ]
    };
  }

  // Default response
  return {
    reply: `I understand you're asking about "${userMessage}". As your vehicle AI assistant, I can help with maintenance, troubleshooting, fuel efficiency, and general vehicle questions. Could you provide more specific details about what you'd like to know?`,
    followUpQuestions: [
      "Tell me about vehicle maintenance",
      "How to improve fuel efficiency?",
      "Help me diagnose a car problem",
      "What oil should I use?"
    ]
  };
};

export const chatAPI: RequestHandler = (req, res) => {
  try {
    const { user_id, messages }: ChatRequest = req.body;
    
    if (!user_id || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: "No user message found" });
    }
    
    // Simulate AI processing delay (3 seconds as requested)
    setTimeout(() => {
      const aiResponse = generateAIResponse(lastUserMessage.content, user_id);
      res.json(aiResponse);
    }, 3000); // 3-second thinking delay
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
