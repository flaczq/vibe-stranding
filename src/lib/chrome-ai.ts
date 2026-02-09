/**
 * Utility to interact with browser-native AI (Gemini Nano in Chrome)
 */

export interface ChromeAI {
    available: boolean;
    reason?: string;
}

export async function checkChromeAI(): Promise<ChromeAI> {
    if (typeof window === 'undefined') return { available: false };

    // @ts-ignore - Chrome AI is experimental
    if (!window.ai || !window.ai.languageModel) {
        return {
            available: false,
            reason: "Chrome Built-in AI not detected. Enable 'Prompt API' in chrome://flags."
        };
    }

    try {
        // @ts-ignore
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === 'no') {
            return { available: false, reason: "Built-in AI is disabled or not downloaded." };
        }
        return { available: true };
    } catch (e) {
        return { available: false, reason: "Error checking AI capabilities." };
    }
}

export async function promptChromeAI(prompt: string, onUpdate?: (text: string) => void): Promise<string> {
    // @ts-ignore
    const session = await window.ai.languageModel.create();

    try {
        if (onUpdate) {
            const stream = session.promptStreaming(prompt);
            let fullText = "";
            for await (const chunk of stream) {
                fullText = chunk;
                onUpdate(fullText);
            }
            return fullText;
        } else {
            return await session.prompt(prompt);
        }
    } finally {
        session.destroy();
    }
}
