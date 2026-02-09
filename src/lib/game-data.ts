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
    // Level 1 - Sprout Challenges
    {
        id: 'prompt-basics-1',
        title: 'Your First Prompt',
        description: 'Learn how to write a clear, effective prompt for an AI assistant',
        category: 'prompting',
        difficulty: 1,
        xpReward: 50,
        instructions: `Write a prompt that asks an AI to create a simple "Hello World" function in JavaScript.

Your prompt should:
1. Be clear and specific
2. Specify the programming language
3. Ask for a complete, runnable function

Type your prompt in the editor below.`,
        hints: [
            'Start by stating what you want clearly',
            'Mention JavaScript specifically',
            'Ask for a function, not just code',
        ],
        tags: ['beginner', 'prompting', 'fundamentals'],
    },
    {
        id: 'prompt-basics-2',
        title: 'Context is King',
        description: 'Learn to provide context in your prompts for better results',
        category: 'prompting',
        difficulty: 1,
        xpReward: 75,
        instructions: `Write a prompt that asks an AI to help fix a bug in your code.

The bug: A function that calculates the sum of an array is returning NaN.

Your prompt should include:
1. The problem description
2. What you expected vs what happened
3. Ask for an explanation, not just a fix`,
        starterCode: `function sumArray(arr) {
  let total;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
        hints: [
            'Describe the expected behavior',
            'Mention the actual behavior (NaN)',
            'Ask "why" not just "how to fix"',
        ],
        tags: ['beginner', 'prompting', 'debugging'],
    },
    {
        id: 'prompt-basics-3',
        title: 'Breaking Down Tasks',
        description: 'Learn to decompose complex requests into smaller prompts',
        category: 'prompting',
        difficulty: 1,
        xpReward: 100,
        instructions: `You want to build a simple todo app. Instead of one massive prompt, 
break it down into 3 smaller, focused prompts.

Write your first prompt: Create the data structure for a todo item.
Then think about what the next 2 prompts would be.`,
        hints: [
            'Think about the pieces: data, display, interactions',
            'Each prompt should have ONE clear goal',
            'Smaller prompts = better results',
        ],
        tags: ['beginner', 'prompting', 'planning'],
    },

    // Level 2 - Apprentice Challenges
    {
        id: 'chain-prompting-1',
        title: 'Prompt Chaining',
        description: 'Build on previous AI outputs to create complex solutions',
        category: 'building',
        difficulty: 2,
        xpReward: 150,
        instructions: `You're building a user authentication system. Create a chain of 3 prompts:

1. First prompt: Create the User interface/type
2. Second prompt: Create a signup function (references the User type)
3. Third prompt: Create a login function (builds on previous code)

Write all three prompts in sequence.`,
        hints: [
            'Reference previous outputs: "Using the User type from before..."',
            'Build incrementally',
            'Keep context between prompts',
        ],
        tags: ['intermediate', 'prompting', 'chaining'],
    },
    {
        id: 'debug-ai-1',
        title: 'AI Generated Bug Hunt',
        description: 'Learn to identify and fix issues in AI-generated code',
        category: 'debugging',
        difficulty: 2,
        xpReward: 175,
        instructions: `The AI generated this code for fetching user data, but it has issues.
Identify the problems and write a prompt to fix them.`,
        starterCode: `async function fetchUser(id) {
  const response = fetch('/api/users/' + id);
  const data = response.json();
  return data;
}

// Usage
const user = fetchUser(123);
console.log(user.name);`,
        hints: [
            'Look for async/await issues',
            'Check error handling',
            'Consider edge cases',
        ],
        tags: ['intermediate', 'debugging', 'async'],
    },
    {
        id: 'refactor-ai-1',
        title: 'Prompt for Refactoring',
        description: 'Learn to write prompts that improve existing code',
        category: 'refactoring',
        difficulty: 2,
        xpReward: 150,
        instructions: `Write a prompt that asks AI to refactor this code to be:
- More readable
- Following best practices
- Have proper error handling`,
        starterCode: `function p(d) {
  if(d.n && d.e && d.a >= 18) {
    return {s: true, m: 'ok'}
  } else {
    return {s: false, m: 'bad'}
  }
}`,
        hints: [
            'Ask for meaningful variable names',
            'Request TypeScript types',
            'Ask for explanation of changes',
        ],
        tags: ['intermediate', 'refactoring', 'best-practices'],
    },

    // Level 3 - Developer Challenges
    {
        id: 'feature-complete-1',
        title: 'Full Feature Build',
        description: 'Use AI to build a complete feature from scratch',
        category: 'building',
        difficulty: 3,
        xpReward: 300,
        instructions: `Build a complete "Dark Mode Toggle" feature using AI prompts.

Your solution should include:
1. React component with toggle button
2. CSS for both light and dark themes
3. Persistence using localStorage
4. Smooth transition animations

Write the prompts you would use to build this.`,
        hints: [
            'Start with the core toggle logic',
            'Add styling in a separate prompt',
            'Handle persistence after core works',
        ],
        tags: ['advanced', 'building', 'react', 'css'],
    },
    {
        id: 'speed-challenge-1',
        title: 'Speed Coding: Form Validation',
        description: 'Build a form validation system as fast as possible',
        category: 'speed',
        difficulty: 3,
        xpReward: 250,
        timeLimit: 300, // 5 minutes
        instructions: `SPEED CHALLENGE! 

Create prompts to build a form validation system that:
- Validates email format
- Checks password strength
- Confirms password match
- Shows error messages

Timer starts now! Write efficient prompts.`,
        hints: [
            'Be concise but specific',
            'One prompt for all validations',
            'Ask for the error messages too',
        ],
        tags: ['advanced', 'speed', 'forms', 'validation'],
    },

    // Level 4 - Expert Challenges
    {
        id: 'architecture-1',
        title: 'System Architecture',
        description: 'Design a complete system architecture with AI assistance',
        category: 'building',
        difficulty: 4,
        xpReward: 500,
        instructions: `Design a real-time chat application architecture using AI.

Create prompts to design:
1. Database schema
2. API endpoints
3. WebSocket events
4. Frontend state management
5. Message encryption approach

Focus on the architecture, not implementation.`,
        hints: [
            'Ask AI to explain trade-offs',
            'Request diagrams in text format',
            'Consider scalability',
        ],
        tags: ['expert', 'architecture', 'system-design'],
    },
    {
        id: 'complex-debug-1',
        title: 'Production Bug Hunt',
        description: 'Debug a complex, multi-file issue with AI assistance',
        category: 'debugging',
        difficulty: 4,
        xpReward: 450,
        instructions: `A production app has a memory leak. Users report the app slowing down after extended use.

Write prompts to:
1. Identify potential causes
2. Create debugging strategies
3. Implement fixes
4. Add monitoring

You have partial stack traces and user reports to work with.`,
        starterCode: `// Error from production logs:
// Warning: Maximum update depth exceeded
// Warning: Can't perform a React state update on an unmounted component

// User report: "App becomes unresponsive after ~30 minutes of use"`,
        hints: [
            'Ask about common memory leak patterns',
            'Request cleanup code patterns',
            'Ask for monitoring solutions',
        ],
        tags: ['expert', 'debugging', 'production', 'performance'],
    },

    // Level 5 - Master Challenges
    {
        id: 'full-app-1',
        title: 'Full Application Build',
        description: 'Build a complete application from concept to deployment',
        category: 'building',
        difficulty: 5,
        xpReward: 1000,
        instructions: `THE ULTIMATE CHALLENGE

Build a complete "Link Shortener" application using only AI assistance.

Requirements:
- User authentication
- URL shortening with custom aliases
- Click tracking and analytics
- Dashboard with charts
- API rate limiting
- Deployment configuration

Document your entire prompt journey from start to finish.`,
        hints: [
            'Plan before prompting',
            'Build incrementally',
            'Test each piece',
            'This is meant to take time',
        ],
        tags: ['master', 'full-stack', 'complete-app'],
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
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Created your VibeCoding account',
        icon: '👋',
        xpBonus: 0,
    },
    {
        id: 'first_challenge',
        name: 'First Blood',
        description: 'Completed your first challenge',
        icon: '🎯',
        xpBonus: 25,
    },
    {
        id: 'prompt_apprentice',
        name: 'Prompt Apprentice',
        description: 'Complete 5 prompting challenges',
        icon: '📝',
        xpBonus: 50,
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a speed challenge under time limit',
        icon: '⚡',
        xpBonus: 75,
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Get perfect score on 5 challenges',
        icon: '💎',
        xpBonus: 100,
    },
    {
        id: 'bug_hunter',
        name: 'Bug Hunter',
        description: 'Complete all debugging challenges',
        icon: '🐛',
        xpBonus: 150,
    },
    {
        id: 'streak_3',
        name: 'On a Roll',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        xpBonus: 50,
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        xpBonus: 100,
    },
    {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '👑',
        xpBonus: 500,
    },
    {
        id: 'level_up_2',
        name: 'Growing Strong',
        description: 'Reach Level 2 - Apprentice',
        icon: '🌿',
        xpBonus: 25,
    },
    {
        id: 'level_up_3',
        name: 'Developer Status',
        description: 'Reach Level 3 - Developer',
        icon: '🌳',
        xpBonus: 50,
    },
    {
        id: 'level_up_4',
        name: 'Expert Mode',
        description: 'Reach Level 4 - Expert',
        icon: '⚡',
        xpBonus: 100,
    },
    {
        id: 'level_up_5',
        name: 'Vibe Master',
        description: 'Reach Level 5 - Master',
        icon: '🔮',
        xpBonus: 250,
    },
    {
        id: 'all_categories',
        name: 'Well Rounded',
        description: 'Complete at least one challenge in each category',
        icon: '🌈',
        xpBonus: 100,
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a challenge between midnight and 4 AM',
        icon: '🦉',
        xpBonus: 25,
        secret: true,
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete a challenge between 5 AM and 7 AM',
        icon: '🐦',
        xpBonus: 25,
        secret: true,
    },
];

// Category info for display
export const CATEGORY_INFO: Record<ChallengeCategory, { name: string; icon: string; color: string }> = {
    prompting: { name: 'Prompt Crafting', icon: '✨', color: '#8b5cf6' },
    debugging: { name: 'Bug Hunting', icon: '🐛', color: '#ef4444' },
    building: { name: 'Feature Building', icon: '🏗️', color: '#22c55e' },
    refactoring: { name: 'Code Refactoring', icon: '🔄', color: '#3b82f6' },
    speed: { name: 'Speed Coding', icon: '⚡', color: '#f59e0b' },
};

// Helper function to get challenges by difficulty
export const getChallengesByLevel = (level: number): Challenge[] => {
    return CHALLENGES.filter((c) => c.difficulty === level);
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
