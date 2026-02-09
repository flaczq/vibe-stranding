// Level definitions
export interface Level {
    id: number;
    name: string;
    icon: string;
    description: string;
    xpRequired: number;
    color: string;
}

export const LEVELS: Level[] = [
    {
        id: 1,
        name: 'Sprout',
        icon: '🌱',
        description: 'Beginning your vibe coding journey',
        xpRequired: 0,
        color: '#94a3b8',
    },
    {
        id: 2,
        name: 'Apprentice',
        icon: '🌿',
        description: 'Learning the art of AI prompting',
        xpRequired: 500,
        color: '#22c55e',
    },
    {
        id: 3,
        name: 'Developer',
        icon: '🌳',
        description: 'Building real features with AI',
        xpRequired: 1500,
        color: '#3b82f6',
    },
    {
        id: 4,
        name: 'Expert',
        icon: '⚡',
        description: 'Mastering complex AI workflows',
        xpRequired: 3500,
        color: '#a855f7',
    },
    {
        id: 5,
        name: 'Master',
        icon: '🔮',
        description: 'The pinnacle of vibe coding',
        xpRequired: 7000,
        color: '#f97316',
    },
];

// Challenge categories
export type ChallengeCategory = 'prompting' | 'debugging' | 'building' | 'refactoring' | 'speed';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    category: ChallengeCategory;
    difficulty: number; // 1-5
    xpReward: number;
    timeLimit?: number; // in seconds, for speed challenges
    instructions: string;
    starterCode?: string;
    expectedOutput?: string;
    hints: string[];
    tags: string[];
}

export const CHALLENGES: Challenge[] = [
    // Level 1 - Sprout Challenges (6 total)
    {
        id: 'prompt-basics-1',
        title: 'Your First Prompt',
        description: 'Learn how to write a clear, effective prompt for an AI assistant',
        category: 'prompting',
        difficulty: 1,
        xpReward: 50,
        instructions: `Write a prompt that asks an AI to create a simple "Hello World" function in JavaScript.`,
        hints: ['Start by stating what you want clearly', 'Mention JavaScript specifically'],
        tags: ['beginner', 'prompting', 'fundamentals'],
    },
    {
        id: 'prompt-basics-2',
        title: 'Context is King',
        description: 'Learn to provide context in your prompts for better results',
        category: 'prompting',
        difficulty: 1,
        xpReward: 75,
        instructions: `Write a prompt that asks an AI to help fix a bug in your code.`,
        starterCode: `function sumArray(arr) { let total; for (let i = 0; i <= arr.length; i++) { total += arr[i]; } return total; }`,
        hints: ['Describe the expected behavior', 'Mention the actual behavior (NaN)'],
        tags: ['beginner', 'prompting', 'debugging'],
    },
    {
        id: 'prompt-basics-3',
        title: 'Breaking Down Tasks',
        description: 'Learn to decompose complex requests into smaller prompts',
        category: 'prompting',
        difficulty: 1,
        xpReward: 100,
        instructions: `Break down building a simple todo app into 3 smaller prompts.`,
        hints: ['Think about the pieces: data, display, interactions'],
        tags: ['beginner', 'prompting', 'planning'],
    },
    {
        id: 'prompt-basics-4',
        title: 'Persona Crafting',
        description: 'Learn how to make the AI act as a specific professional',
        category: 'prompting',
        difficulty: 1,
        xpReward: 60,
        instructions: `Write a prompt asking the AI to act as a "Senior UI/UX Designer" and review a basic HTML button.`,
        hints: ['Tell the AI exactly what its role is', 'Specify the tone (constructive, professional)'],
        tags: ['beginner', 'persona', 'ux'],
    },
    {
        id: 'prompt-basics-5',
        title: 'Zero-Shot vs Few-Shot',
        description: 'Understand the difference between asking and showing examples',
        category: 'prompting',
        difficulty: 1,
        xpReward: 80,
        instructions: `Write a "few-shot" prompt that gives the AI 2 examples of turning a plain sentence into a "vibe coding" style sentence.`,
        hints: ['Provide pattern: Input -> Output', 'Follow with your actual request'],
        tags: ['beginner', 'few-shot', 'patterns'],
    },
    {
        id: 'prompt-basics-6',
        title: 'The Art of Precision',
        description: 'Learn to avoid ambiguity in your requests',
        category: 'prompting',
        difficulty: 1,
        xpReward: 90,
        instructions: `Write a prompt to generate a Python dictionary containing the top 3 cities in Poland and their population, formatted exactly as JSON.`,
        hints: ['Specify the format clearly', 'Mention any constraints or data types'],
        tags: ['beginner', 'precision', 'json'],
    },

    // Level 2 - Apprentice Challenges (6 total)
    {
        id: 'chain-prompting-1',
        title: 'Prompt Chaining',
        description: 'Build on previous AI outputs to create complex solutions',
        category: 'building',
        difficulty: 2,
        xpReward: 150,
        instructions: `Create a chain of 3 prompts to build a basic user authentication flow.`,
        hints: ['Reference previous outputs', 'Build incrementally'],
        tags: ['intermediate', 'prompting', 'chaining'],
    },
    {
        id: 'debug-ai-1',
        title: 'AI Generated Bug Hunt',
        description: 'Learn to identify and fix issues in AI-generated code',
        category: 'debugging',
        difficulty: 2,
        xpReward: 175,
        instructions: `Identify issues in the AI code for fetching user data and write a prompt to fix them.`,
        starterCode: `async function fetchUser(id) { const response = fetch('/api/users/' + id); const data = response.json(); return data; }`,
        hints: ['Look for async/await issues', 'Check error handling'],
        tags: ['intermediate', 'debugging', 'async'],
    },
    {
        id: 'refactor-ai-1',
        title: 'Prompt for Refactoring',
        description: 'Learn to write prompts that improve existing code',
        category: 'refactoring',
        difficulty: 2,
        xpReward: 150,
        instructions: `Write a prompt to refactor a complex if-else chain into a switch statement or object literal mapping.`,
        starterCode: `function getStatus(code) { if(code === 'a') return 'Active'; else if(code === 'p') return 'Pending'; else return 'None'; }`,
        hints: ['Ask for readability improvements', 'Suggest specific patterns'],
        tags: ['intermediate', 'refactoring', 'clean-code'],
    },
    {
        id: 'conditional-prompts-1',
        title: 'Logic Branching',
        description: 'Prompts that change behavior based on system input',
        category: 'prompting',
        difficulty: 2,
        xpReward: 160,
        instructions: `Write a system prompt that handles two types of users: "Admin" and "Guest", giving different access instructions to each.`,
        hints: ['Use If/Then logic in the prompt', 'Be explicit about the boundaries'],
        tags: ['intermediate', 'logic', 'system-prompts'],
    },
    {
        id: 'style-refactor-1',
        title: 'Clean Architecture Basics',
        description: 'Refactor small functions for better testability',
        category: 'refactoring',
        difficulty: 2,
        xpReward: 180,
        instructions: `Refactor a function that does both data calculation and UI logging into two separate functions.`,
        starterCode: `function saveAndLog(val) { const newXp = val * 10; console.log('Saving XP:', newXp); return newXp; }`,
        hints: ['Ask the AI to follow the Single Responsibility Principle'],
        tags: ['intermediate', 'refactoring', 'patterns'],
    },
    {
        id: 'interactive-debug-1',
        title: 'Interactive Debugging',
        description: 'Using AI as a pair programmer to hunt logic errors',
        category: 'debugging',
        difficulty: 2,
        xpReward: 200,
        instructions: `Write a prompt that asks the AI to play "The Rubber Duck" and help you find why a loop is running infinitely.`,
        hints: ['Explain what you think is happening', 'Ask the AI to ask YOU questions'],
        tags: ['intermediate', 'debugging', 'logic'],
    },

    // Level 3 - Developer Challenges (4 total)
    {
        id: 'feature-complete-1',
        title: 'Full Feature Build',
        description: 'Use AI to build a complete feature from scratch',
        category: 'building',
        difficulty: 3,
        xpReward: 300,
        instructions: `Build a complete "Dark Mode Toggle" feature using AI prompts.`,
        hints: ['Start with the core toggle logic', 'Add styling in a separate prompt'],
        tags: ['advanced', 'building', 'react', 'css'],
    },
    {
        id: 'speed-challenge-1',
        title: 'Speed Coding: Form Validation',
        description: 'Build a form validation system as fast as possible',
        category: 'speed',
        difficulty: 3,
        xpReward: 250,
        timeLimit: 300,
        instructions: `Create prompts for a form validation system (Email, Password, Match).`,
        hints: ['Be concise but specific', 'One prompt for all validations'],
        tags: ['advanced', 'speed', 'forms', 'validation'],
    },
    {
        id: 'api-integration-1',
        title: 'API Bridge',
        description: 'Connect AI logic to real-world data sources',
        category: 'building',
        difficulty: 3,
        xpReward: 320,
        instructions: `Write prompts to create a service that fetches data from a weather API and transforms it into a custom dashboard format.`,
        hints: ['Specify the API endpoint and expected fields', 'Explain the final structure needed'],
        tags: ['advanced', 'api', 'transformation'],
    },
    {
        id: 'speed-state-1',
        title: 'State Management Race',
        description: 'Implement a complex cart state machine under pressure',
        category: 'speed',
        difficulty: 3,
        xpReward: 280,
        timeLimit: 240,
        instructions: `Prompt the AI to build a shopping cart state handler (add, remove, clear, total) in under 4 minutes.`,
        hints: ['List all actions in the first prompt', 'Ask for a Reducer or Hook pattern'],
        tags: ['advanced', 'speed', 'react', 'state'],
    },

    // Level 4 - Expert Challenges (4 total)
    {
        id: 'architecture-1',
        title: 'System Architecture',
        description: 'Design a complete system architecture with AI assistance',
        category: 'building',
        difficulty: 4,
        xpReward: 500,
        instructions: `Design a real-time chat application architecture using AI.`,
        hints: ['Ask AI to explain trade-offs', 'Consider scalability'],
        tags: ['expert', 'architecture', 'system-design'],
    },
    {
        id: 'complex-debug-1',
        title: 'Production Bug Hunt',
        description: 'Debug a complex, multi-file issue with AI assistance',
        category: 'debugging',
        difficulty: 4,
        xpReward: 450,
        instructions: `Debug a memory leak in a production React application.`,
        hints: ['Ask about common memory leak patterns', 'Request monitoring solutions'],
        tags: ['expert', 'debugging', 'production', 'performance'],
    },
    {
        id: 'security-expert-1',
        title: 'Security First',
        description: 'Fortifying applications against vulnerabilities',
        category: 'debugging',
        difficulty: 4,
        xpReward: 550,
        instructions: `Show the AI a code snippet with an XSS vulnerability and write a prompt to secure it while explaining the attack vector.`,
        hints: ['Focus on input sanitization', 'Ask for prevention strategies'],
        tags: ['expert', 'security', 'xss'],
    },
    {
        id: 'perf-refactor-1',
        title: 'Performance Tuning',
        description: 'Using AI to identify bottlenecks in large datasets',
        category: 'refactoring',
        difficulty: 4,
        xpReward: 480,
        instructions: `Provide a slow data manipulation script and ask the AI to refactor it using specialized data structures (Sets, Maps, or TypedArrays).`,
        hints: ['Mention the time/space complexity', 'Ask for before/after benchmarks'],
        tags: ['expert', 'performance', 'refactoring'],
    },

    // Level 5 - Master Challenges (2 total)
    {
        id: 'full-app-1',
        title: 'Full Application Build',
        description: 'Build a complete application from concept to deployment',
        category: 'building',
        difficulty: 5,
        xpReward: 1000,
        instructions: `Build a complete "Link Shortener" application using only AI assistance.`,
        hints: ['Plan before prompting', 'Test each piece'],
        tags: ['master', 'full-stack', 'complete-app'],
    },
    {
        id: 'saas-architecture-1',
        title: 'AI SaaS Blueprint',
        description: 'Architecting the future of subscription services',
        category: 'building',
        difficulty: 5,
        xpReward: 1200,
        instructions: `Architect a full-stack AI-as-a-Service platform (Billing, Auth, AI Queue, Webhooks). Document the entire prompt journey.`,
        hints: ['Decompose the system into microservices', 'Ask for infrastructure as code patterns'],
        tags: ['master', 'saas', 'architecture'],
    },
];

// Achievements
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpBonus: number;
    secret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_steps', name: 'First Steps', description: 'Created your VibeCoding account', icon: '👋', xpBonus: 0 },
    { id: 'first_challenge', name: 'First Blood', description: 'Completed your first challenge', icon: '🎯', xpBonus: 25 },
    { id: 'prompt_apprentice', name: 'Prompt Apprentice', description: 'Complete 5 prompting challenges', icon: '📝', xpBonus: 50 },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a speed challenge under time limit', icon: '⚡', xpBonus: 75 },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Get perfect score on 5 challenges', icon: '💎', xpBonus: 100 },
    { id: 'bug_hunter', name: 'Bug Hunter', description: 'Complete all debugging challenges', icon: '🐛', xpBonus: 150 },
    { id: 'streak_3', name: 'On a Roll', description: 'Maintain a 3-day streak', icon: '🔥', xpBonus: 50 },
    { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', xpBonus: 100 },
    { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', xpBonus: 500 },
    { id: 'level_up_2', name: 'Growing Strong', description: 'Reach Level 2 - Apprentice', icon: '🌿', xpBonus: 25 },
    { id: 'level_up_3', name: 'Developer Status', description: 'Reach Level 3 - Developer', icon: '🌳', xpBonus: 50 },
    { id: 'level_up_4', name: 'Expert Mode', description: 'Reach Level 4 - Expert', icon: '⚡', xpBonus: 100 },
    { id: 'level_up_5', name: 'Vibe Master', description: 'Reach Level 5 - Master', icon: '🔮', xpBonus: 250 },
    { id: 'all_categories', name: 'Well Rounded', description: 'Complete at least one challenge in each category', icon: '🌈', xpBonus: 100 },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete a challenge between midnight and 4 AM', icon: '🦉', xpBonus: 25, secret: true },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete a challenge between 5 AM and 7 AM', icon: '🐦', xpBonus: 25, secret: true },
];

// Category info for display
export const CATEGORY_INFO: Record<ChallengeCategory, { name: string; icon: string; color: string }> = {
    prompting: { name: 'Prompt Crafting', icon: '✨', color: '#8b5cf6' },
    debugging: { name: 'Bug Hunting', icon: '🐛', color: '#ef4444' },
    building: { name: 'Feature Building', icon: '🏗️', color: '#22c55e' },
    refactoring: { name: 'Code Refactoring', icon: '🔄', color: '#3b82f6' },
    speed: { name: 'Speed Coding', icon: '⚡', color: '#f59e0b' },
};

// Seeded shuffle utility
export function seededShuffle<T>(array: T[], seed: string): T[] {
    const shuffled = [...array];
    // Simple numeric hash of the seed string
    let numericSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (numericSeed + i) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        // Mutate numericSeed slightly for the next iteration
        numericSeed = (numericSeed * 9301 + 49297) % 233280;
    }
    return shuffled;
}

// Helper function to get challenges by difficulty with deterministic shuffle per user
export const getChallengesByLevel = (level: number, userId?: string): Challenge[] => {
    const filtered = CHALLENGES.filter((c) => c.difficulty === level);
    if (!userId) return filtered;
    return seededShuffle(filtered, userId);
};

// Helper function to get level info
export const getLevelInfo = (level: number): Level => {
    return LEVELS.find((l) => l.id === level) || LEVELS[0];
};

// XP requirements for next level
export const getXPProgress = (xp: number, level: number): { current: number; needed: number; percentage: number } => {
    const currentLevelXP = LEVELS[level - 1]?.xpRequired || 0;
    const nextLevelXP = LEVELS[level]?.xpRequired || LEVELS[LEVELS.length - 1].xpRequired;

    const progressTowardsNext = xp - currentLevelXP;
    const xpNeededForNext = nextLevelXP - currentLevelXP;

    return {
        current: progressTowardsNext,
        needed: xpNeededForNext,
        percentage: Math.min((progressTowardsNext / xpNeededForNext) * 100, 100),
    };
};
