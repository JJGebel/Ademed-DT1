const PROMPT_INPUT = document.querySelector('.chat-prompt input');
const CHAT_BOX = document.querySelector('.chat-view');

// Conversation history storage
let conversationHistory = [
    {
        role: 'system',
        content: 'Use conversational chat style up to 10 words. Follow this workflow: 1. Once they share their goal, acknowledge it with enthusiasm and ask about the first baby step needed 2. If the task is specyfic enough (less than 1/3 of the main goal), ask about the next step, if not, ask about subsequent steps to that step until they meet that criteria (less than 1/3, doable in 30 minutes). REMEMBER: DO NOT BREAK THE GOAL INTO STEPS FOR THE USER, UNLESS HE EXPLICITLY ASK YOU TO DO SO. IF HE ASK YOU TO PROPOSE THE NEXT STEP, YOU HAVE 40 WORDS LIMIT AND YOU SHOULD PROPOSE A COUPLE OF OPITIONS. DO NOT HIS KNOWLEDGE, DO NOT HELP HIM TO LEARN THIS SUBJECT, DO NOT ASK FOR DETAILS. THE ONLY THING YOU DO IS ASKING HIM ABOUT THE NEXT BABY-STEPS TOWARD HIS GOAL. DO NOT DIVE TOO DEEP, WHEN THE STEP IS ACHIEVABLE IN LESS THAN 1h, ASK ABOUT THE NEXT STEP TO THE MAIN GOAL. GOOD EXAMPLE: U:Linux terminal AI:Hello! Whats your goal with the Linux terminal? Whats the very first step? U:Navigating dirs for 30 min AI:Ok. So the first task would be: Practicing navigation duration:30 min. What would be the next step for learning the terminal or navigation?'
    }
];

function sendToAi() {
    const userInput = PROMPT_INPUT.value.trim();
    
    if (!userInput) return;
    
    // Check for /end command
    const isEnding = userInput.toLowerCase() === '/end';
    
    if (!isEnding) {
        // Add user message to display
        CHAT_BOX.innerHTML += '<div class="bubble sent">' + userInput + '</div>';
        
        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: userInput
        });
    } else {
        // Send a separate request for summary with dedicated system prompt
        const summaryPrompt = 'Based on the following conversation, summarize the main goal and all baby steps mentioned. Categorize steps as knowledge-based (learning something new, understanding concepts, gathering information) or time-based (allocating time, scheduling work, setting deadlines).'

        // Create summary history with conversation context (exclude original system prompt)
        const summaryHistory = [
            { role: 'system', content: summaryPrompt },
            ...conversationHistory.slice(1)
        ];

        // Send summary request
        fetch('functions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                history: summaryHistory
            })
        })
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            console.log('Summary PHP responded:', data);
            
            // Try to parse as JSON for pretty display
            try {
                const summary = JSON.parse(data);
                CHAT_BOX.innerHTML += '<div class="bubble received"><strong>Summary:</strong></div>';
                CHAT_BOX.innerHTML += '<div class="bubble received">Goal: ' + summary.goal + '</div>';
                CHAT_BOX.innerHTML += '<div class="bubble received">Knowledge steps: ' + summary.knowledge_based_steps.join(', ') + '</div>';
                CHAT_BOX.innerHTML += '<div class="bubble received">Time steps: ' + summary.time_based_steps.join(', ') + '</div>';
            } catch (e) {
                // Not valid JSON, show raw response
                CHAT_BOX.innerHTML += '<div class="bubble received">Summary: ' + data + '</div>';
            }
            
            CHAT_BOX.scrollTop = CHAT_BOX.scrollHeight;
        })
        .catch(function(error) {
            console.error('Communication error:', error);
            CHAT_BOX.innerHTML += '<div class="bubble received" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">Communication error: ' + error + '</div>';
        });
        
        PROMPT_INPUT.value = '';
        return; // Don't continue with normal flow
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
        CHAT_BOX.innerHTML += '<div class="bubble received">' + data + '</div>';
        
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
        CHAT_BOX.innerHTML += '<div class="bubble received" style="background: #f8d7da; color: #721c24; border-color: #f5c6cb;">Communication error: ' + error + '</div>';
    });
    
    PROMPT_INPUT.value = '';
}

// Handle Enter key
PROMPT_INPUT.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendToAi();
    }
});