export interface VibeResult {
    success: boolean;
    score: number; // 0-100
    feedback: string;
    output: string;
}

interface PromptMetric {
    keywords: string[];
    intent: string[];
    context: string[];
    negative?: string[];
}

const CHALLENGE_METRICS: Record<string, PromptMetric> = {
    'prompt-basics-1': {
        keywords: ['hello world', 'javascript', 'function', 'console.log'],
        intent: ['create', 'write', 'generate', 'show'],
        context: ['simple', 'basic', 'tutorial'],
    },
    'prompt-basics-2': {
        keywords: ['nan', 'sum', 'array', 'undefined', 'initialize'],
        intent: ['explain', 'fix', 'debug', 'why'],
        context: ['error', 'math', 'loop'],
    },
    'prompt-basics-3': {
        keywords: ['todo', 'data structure', 'interface', 'type', 'object', 'properties'],
        intent: ['break down', 'decompose', 'structure', 'define'],
        context: ['planning', 'component', 'todo app'],
    },
    'chain-prompting-1': {
        keywords: ['user', 'signup', 'login', 'interface', 'function', 'auth'],
        intent: ['chain', 'sequence', 'next', 'incremental'],
        context: ['authentication', 'steps', 'flow'],
    },
    'debug-ai-1': {
        keywords: ['await', 'fetch', 'async', 'promise', 'json'],
        intent: ['fix', 'wait', 'solve', 'synchronous'],
        context: ['api', 'network', 'loading'],
    },
    'refactor-ai-1': {
        keywords: ['readable', 'clean', 'descriptive', 'types', 'interface'],
        intent: ['refactor', 'improve', 'cleanup', 'standardize'],
        context: ['best practices', 'maintenance', 'naming'],
    },
    'feature-complete-1': {
        keywords: ['dark mode', 'toggle', 'localstorage', 'persistence', 'react', 'hook', 'storage'],
        intent: ['complete', 'full', 'build', 'implement'],
        context: ['feature', 'ux', 'state management'],
    }
};

/**
 * A more sophisticated validator that simulates "AI Reasoning"
 */
export function validateVibe(challengeId: string, input: string): VibeResult {
    const text = input.toLowerCase();
    const metric = CHALLENGE_METRICS[challengeId];

    if (!metric) {
        // Generic fallback
        const score = Math.min(100, (input.length / 50) * 100);
        return {
            success: score > 70,
            score: Math.round(score),
            feedback: score > 70 ? "Your vibe is strong! Good detail." : "Your prompt feels a bit hollow. Add more context!",
            output: "// AI synthesized your request based on the vibes provided."
        };
    }

    let keywordScore = 0;
    let intentScore = 0;
    let contextScore = 0;

    // 1. Calculate Keyword Density
    const foundKeywords = metric.keywords.filter(k => text.includes(k));
    keywordScore = (foundKeywords.length / metric.keywords.length) * 100;

    // 2. Calculate Intent Clarity (Verbs)
    const foundIntents = metric.intent.filter(i => text.includes(i));
    intentScore = foundIntents.length > 0 ? 100 : 0;

    // 3. Calculate Contextual Depth
    const foundContext = metric.context.filter(c => text.includes(c));
    contextScore = (foundContext.length / metric.context.length) * 100;

    // Weighted Total
    const totalScore = Math.round(
        (keywordScore * 0.5) +
        (intentScore * 0.3) +
        (contextScore * 0.2)
    );

    const success = totalScore >= 70;

    // Advanced Feedback Generation
    let feedback = "";
    if (success) {
        const qualityPrefix = totalScore > 90 ? "Spectacular aura! ✨" : totalScore > 80 ? "Strong technical vibe." : "Vibe check passed.";
        feedback = `${qualityPrefix} You covered ${foundKeywords.length} core concepts. Your intent (${foundIntents[0] || 'clear'}) was effectively communicated.`;
    } else {
        const missing = metric.keywords.filter(k => !foundKeywords.includes(k)).slice(0, 2);
        const tip = foundIntents.length === 0 ? "try using more active verbs like 'refactor' or 'implement'" : `consider mentioning "${missing.join('" and "')}"`;
        feedback = `The AI is hallucinating slightly. To ground it, ${tip}.`;
    }

    return {
        success,
        score: totalScore,
        feedback,
        output: generateMockOutput(challengeId, success, foundKeywords)
    };
}

function generateMockOutput(challengeId: string, success: boolean, keywords: string[]): string {
    if (!success) {
        return `// AI ERROR: Vibe mismatch detected.\n// Recommendation: Be more specific about the technical requirements.\n// Missing Context: ${CHALLENGE_METRICS[challengeId]?.keywords.slice(0, 3).join(', ')}...`;
    }

    switch (challengeId) {
        case 'prompt-basics-1':
            return `// AI: Synthesizing Hello World...\n\nfunction helloWorld() {\n    console.log("Hello, World!");\n}\n\n// Optimization: Specified language: JavaScript.`;

        case 'prompt-basics-2':
            return `// AI Debug Insight:\n// The variable 'total' is undefined in the first iteration.\n\nfunction sumArray(arr) {\n    let total = 0; // Fix: Initialize with 0\n    for (let i = 0; i < arr.length; i++) {\n        total += arr[i];\n    }\n    return total;\n}`;

        case 'prompt-basics-3':
            return `// AI Structure Design:\n\ninterface TodoItem {\n    id: string;\n    text: string;\n    completed: boolean;\n    createdAt: Date;\n}\n\n// Plan: 1. Define Interface (Done) -> 2. State Management -> 3. UI Implementation`;

        case 'chain-prompting-1':
            return `// AI Chain Step 3/3:\n\nasync function login(email, password) {\n    const user = await db.user.findUnique({ where: { email } });\n    // ... validation logic building on the User interface from Prompt 1\n    return { success: true, token: "vibe_..." };\n}`;

        case 'debug-ai-1':
            return `// AI Async Correction:\n\nasync function fetchUser(id) {\n    const response = await fetch('/api/users/' + id); // Added await\n    const data = await response.json(); // Added await\n    return data;\n}`;

        case 'refactor-ai-1':
            return `// AI Refactor Results:\n\ninterface ValidationResult {\n    isValid: boolean;\n    message: string;\n}\n\nfunction validateUserAge(user: User): ValidationResult {\n    const isAdult = user.age >= 18;\n    return {\n        isValid: isAdult && user.name && user.email,\n        message: isAdult ? 'User valid' : 'User must be 18+'\n    };\n}`;

        case 'feature-complete-1':
            return `// AI Feature Synthesis [Dark Mode]:\n\nexport function useDarkMode() {\n    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');\n    \n    useEffect(() => {\n        document.documentElement.classList.toggle('dark', theme === 'dark');\n        localStorage.setItem('theme', theme);\n    }, [theme]);\n\n    return [theme, setTheme];\n}`;

        default:
            return "// AI: Vibe synthesized successfully. Logic verified.";
    }
}
