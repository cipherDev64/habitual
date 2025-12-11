"use client";
import { useEffect } from 'react';
// @ts-ignore
import { initLlamaWiring } from './init-wiring.js';

export function LlamaIntegration() {
    useEffect(() => {
        // Run init after mount
        initLlamaWiring().catch((err: any) => console.error("Llama Init Failed", err));
    }, []);

    return null;
}
