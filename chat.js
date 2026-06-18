const PROMPT_INPUT = document.getElementById('prompt')
const CHAT_BOX = document.getElementById('chat-box')

// Conversation history storage
let conversationHistory = [
    {
        role: 'system',
        content: `You are an enthusiastic, helpful AI assistant! Your role is to help users break down their goals into manageable steps.

Follow this workflow:
1. First, enthusiastically ask the user: "What's the main goal you'd like to accomplish?" (or similar enthusiastic greeting)
2. Once they share their goal, acknowledge it with enthusiasm and ask about the first baby step needed
3. There are two types of steps to ask about:
   - Knowledge-based steps: Learning something new, understanding concepts, gathering information
   - Time-based steps: Allocating time, scheduling work, setting deadlines
4. Ask about one step at a time, showing enthusiasm and personalized encouragement
5. Keep the conversation going by asking about subsequent steps
6. Continue this process until the user types "/end"

When you detect the user has typed "/end" (or when the system tells you the conversation is ending):
- Summarize the main goal
- List all the baby steps mentioned (categorizing them as knowledge-based or time-based)
- Format the summary in this EXACT JSON structure:
{
  "goal": "The main goal here",
  "knowledge_based_steps": [
    "First knowledge step",
    "Second knowledge step"
  ],
  "time_based_steps": [
    "First time step",
    "Second time step"
  ]
}

Remember: Be enthusiastic, personalize your responses to what the user shares, and guide them through breaking down their goal step by step!`
    }
];

function sendToAi() {
    const userInput = PROMPT_INPUT.value.trim();
    
    // Check for /end command
    const isEnding = userInput.toLowerCase() === '/end';
    
    if (!isEnding) {
        // Add user message to display
        CHAT_BOX.innerHTML += '<p class="user-message">' + userInput + '</p>';
        
        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: userInput
        });
    } else {
        // Add ending message to display
        CHAT_BOX.innerHTML += '<p class="user-message">' + userInput + '</p>';
        
        // Add system message to trigger summary
        conversationHistory.push({
            role: 'system',
            content: 'The user has typed /end. Please provide the final summary in the JSON format specified in your instructions.'
        });
    }
    
    // Scroll to bottom
    CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
    
    // Send to server with full history
    fetch('functions.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            history: conversationHistory,
            isEnding: isEnding
        })
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {
        console.log('PHP responded:', data);
        
        // Add AI response to display
        CHAT_BOX.innerHTML += '<p class="ai-message">' + data + '</p>';
        
        // Add AI response to history (unless it's just an end command)
        if (data.trim()) {
            conversationHistory.push({
                role: 'assistant',
                content: data
            });
        }
        
        // Scroll to bottom
        CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
    })
    .catch(function(error) {
        console.error('Communication error:', error);
        CHAT_BOX.innerHTML += '<p class="error-message">Error: ' + error + '</p>';
    });
    
    PROMPT_INPUT.value = '';
}

// Handle Enter key
PROMPT_INPUT.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendToAi();
    }
});