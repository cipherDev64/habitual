
export function buildPromptFromHistory(messages) {
    // Simple placeholder for history trimming
    // In a real app, you'd parse the DOM or React state to get history
    return messages.map(m => m.content).join('\n');
}
