/*
 * Llama Client Adapter
 * Main thread API to communicate with the Llama Web Worker.
 */

class LlamaClient {
    constructor() {
        this.worker = null;
        this.pending = new Map(); // id -> { resolve, reject, onToken }
        this.isReady = false;
        this.config = {};
    }

    async init({ modelUrl, workerUrl, options = {} }) {
        if (this.worker) return;

        this.worker = new Worker(workerUrl);
        this.config = options;

        this.worker.onmessage = (e) => {
            const { type, id, token, message } = e.data;

            if (type === 'ready') {
                this.isReady = true;
                console.log('LlamaClient: Model ready');
                // Resolve any pending init promises if we had them (not implemented here simple)
                return;
            }

            const request = this.pending.get(id);
            if (!request) return;

            switch (type) {
                case 'token':
                    if (request.onToken) request.onToken(token);
                    break;
                case 'done':
                    request.resolve();
                    this.pending.delete(id);
                    break;
                case 'error':
                    request.reject(new Error(message));
                    this.pending.delete(id);
                    break;
            }
        };

        return new Promise((resolve, reject) => {
            // We listen for the first ready message to resolve init
            const onReady = (e) => {
                if (e.data.type === 'ready') {
                    this.worker.removeEventListener('message', onReady);
                    resolve();
                } else if (e.data.type === 'error') {
                    this.worker.removeEventListener('message', onReady);
                    reject(new Error(e.data.message));
                }
            };
            this.worker.addEventListener('message', onReady);

            this.worker.postMessage({
                type: 'init',
                modelUrl,
                options
            });
        });
    }

    generate({ prompt, onToken, signal, ...options }) {
        if (!this.isReady) {
            return Promise.reject(new Error('Model not ready'));
        }

        const id = crypto.randomUUID();

        return new Promise((resolve, reject) => {
            this.pending.set(id, { resolve, reject, onToken });

            this.worker.postMessage({
                type: 'generate',
                id,
                prompt,
                options
            });

            if (signal) {
                signal.addEventListener('abort', () => {
                    this.worker.postMessage({ type: 'stop', id });
                    this.pending.delete(id);
                    reject(new Error('Aborted'));
                });
            }
        });
    }
}

// Singleton instance
export const llama = new LlamaClient();

if (typeof window !== 'undefined') {
    window.LlamaAdapter = llama;
}
