# Local Llama Integration

This directory contains the logic for running a local Llama model in the browser via WebAssembly, integrating non-invasively with the existing chat UI.

## Setup

1.  **Download a Model**:
    You need a `.gguf` model file (optimized for WASM if possible, or generic GGUF).
    Place it in `public/models/`.
    Example: `public/models/Phi-2 (Q4_K_M).gguf`.

2.  **Configuration**:
    The integration uses `window.LLAMA_INTEGRATION_CONFIG`. You can override defaults in your code or updating `src/llama/init-wiring.js` defaults.

    ```javascript
    window.LLAMA_INTEGRATION_CONFIG = {
        attachToUI: true,
        modelUrl: '/models/Phi-2 (Q4_K_M).gguf',
        workerUrl: '/src/llama/worker.js',
        // selectors matching your UI
        inputSelector: 'input[type="text"]',
        scrollAreaSelector: '#chat-container',
        formSelector: 'form'
    };
    ```

3.  **WASM Wrapper**:
    `src/llama/worker.js` contains a TODO where you must import your specific WASM bindings (e.g., from `llama.cpp` dictribution). currently it runs in **MOCK MODE** (simulation).

## Files

-   `worker.js`: Runs in a WebWorker, handles heavy inference.
-   `llama-client.js`: Main thread adapter.
-   `init-wiring.js`: DOM Shim that listens to the existing UI's form submit.
-   `file_utils.js`: Helpers.

## Fallback

If the browser cannot run the model, a Python fallback server snippet is provided in `fallback-server-snippet.py`.
