/*
 * Llama UI Wiring (Shim)
 * Attaches to existing chat UI and intercepts sends to pipe through local model.
 */

import { llama } from './llama-client.js';
import { SYSTEM_CONTEXT } from './knowledge_base.js';

const DEFAULT_CONFIG = {
    attachToUI: true,
    chatContainerSelector: '#chat-container',
    scrollAreaSelector: '#chat-container',
    inputSelector: 'input[placeholder="Type your message..."]',
    formSelector: '#chat-form',
    modelUrl: '/models/gemma-2b-it.Q4_K_M.gguf',
    workerUrl: '/llama/worker.js',
};

// Global for config overrides
if (typeof window !== 'undefined') {
    window.LLAMA_INTEGRATION_CONFIG = Object.assign({}, DEFAULT_CONFIG, window.LLAMA_INTEGRATION_CONFIG || {});
}

export async function initLlamaWiring() {
    if (typeof window === 'undefined') return;
    const config = window.LLAMA_INTEGRATION_CONFIG;
    if (!config.attachToUI) return;

    try {
        console.log('LlamaShim: Initializing...');

        // Show loading state
        const loadingMsg = createSystemMessage('Loading local model...');

        await llama.init({
            modelUrl: config.modelUrl,
            workerUrl: config.workerUrl
        });

        // Update system message
        if (loadingMsg) loadingMsg.textContent = 'Local model ready.';
        setTimeout(() => loadingMsg?.remove(), 3000);

        // UI is dynamic (React), so we use event delegation on body
        document.body.addEventListener('submit', (e) => {
            if (e.target.matches(config.formSelector)) {
                handleFormSubmit(e, config);
            }
        });

    } catch (err) {
        console.error('LlamaShim: Failed to init', err);
        createSystemMessage('Local model failed: ' + err.message);
    }
}

function handleFormSubmit(e, config) {
    // We don't preventDefault() because we want the existing React UI to handle the user message display.
    // But we DO want to trigger our local generation.

    const input = e.target.querySelector(config.inputSelector);
    if (!input) return;

    const text = input.value;
    if (!text.trim()) return;

    // Give React a moment to clear input and add user message
    setTimeout(() => runGeneration(text, config), 100);
}

async function runGeneration(userText, config) {
    const container = document.querySelector(config.scrollAreaSelector);
    if (!container) return;

    // Create a bot bubble
    const bubble = document.createElement('div');
    bubble.className = "flex w-fit max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap bg-muted border-2 border-green-500/20"; // Add subtle border to distinguish
    bubble.style.marginTop = "8px";
    bubble.textContent = "Llama: ";
    container.appendChild(bubble);

    // Scroll to bottom
    bubble.scrollIntoView({ behavior: 'smooth' });

    try {
        await llama.generate({
            // Gemma Chat Template: <start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n
            // We inject the system context into the first user turn to prime the model.
            prompt: `<start_of_turn>user\n${SYSTEM_CONTEXT}\n\nUser Question: ${userText}<end_of_turn>\n<start_of_turn>model\n`,
            onToken: (token) => {
                bubble.textContent += token;
                // Auto-scroll
                bubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    } catch (err) {
        bubble.textContent += "\n[Error: " + err.message + "]";
    }
}

function createSystemMessage(text) {
    // Helper to inject a small system toast/message
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '80px';
    div.style.right = '20px';
    div.style.background = '#333';
    div.style.color = '#fff';
    div.style.padding = '8px 12px';
    div.style.borderRadius = '4px';
    div.style.fontSize = '12px';
    div.style.zIndex = '9999';
    div.textContent = text;
    document.body.appendChild(div);
    return div;
}
