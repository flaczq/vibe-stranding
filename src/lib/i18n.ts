export type Language = 'en' | 'pl';

export const translations = {
    en: {
        appName: "Vibe Stranding",
        nav: {
            dashboard: "Dashboard",
            learn: "Learn",
            network: "The Network",
            compete: "Compete",
            leaderboard: "Leaderboard",
            profile: "Profile",
            logout: "Logout",
        },
        categories: {
            prompting: "Prompt Crafting",
            debugging: "Bug Hunting",
            building: "Feature Building",
            refactoring: "Code Refactoring",
            speed: "Speed Coding"
        },
        hero: {
            title: "Master the Art of",
            subtitle: "Vibe Stranding is a growing playground where you can enjoy and learn the future of AI. Fully free to explore interactive challenges and master the art of vibe coding.",
            cta: "Start Your Journey",
            login: "I Have an Account"
        },
        dashboard: {
            welcome: "Welcome back, ",
            stillBreathing: "Still breathing, ",
            networkStatus: "Network Status",
            stats: {
                challenges: "Challenges",
                streak: "Streak",
                achievements: "Achievements",
                totalXp: "Total XP",
                completed: "completed",
                days: "days",
                earned: "earned"
            },
            actions: {
                continue: "Continue Learning",
                searchStrands: "Search for Strands",
                connections: "connections to restore",
                challengesLeft: "challenges left",
                competition: "Enter Competition",
                testSkills: "Test your skills against others"
            },
            tips: {
                title: "Pro Vibe Coding Tips",
                survivalTitle: "Surviving the Future",
                tip1: "Context is King 👑",
                tip1Desc: "Always provide the AI with clear examples of your code structure and goals.",
                tip2: "Iterate, Don't Argue 🔄",
                tip2Desc: "If the AI misses the vibe, refine your prompt rather than repeating the same one.",
                tip3: "Review the Aura ✨",
                tip3Desc: "Never just copy-paste. Read the code to ensure it matches your project's soul.",
                tip4: "Use Pseudo-Code 🧠",
                tip4Desc: "Ask the AI to outline the logic first before writing a single line of implementation."
            },
            quest: {
                title: "Daily Quest",
                accept: "Accept Quest →",
                enterStorm: "Enter the Storm →"
            }
        },
        auth: {
            loginTitle: "Welcome Back!",
            signupTitle: "Join Vibe Stranding",
            loginSubtitle: "Continue your journey",
            signupSubtitle: "Survival is better with AI. Start your journey.",
            username: "Username",
            email: "Email address",
            password: "Password",
            confirmPassword: "Confirm password",
            loginBtn: "Enter the Vibe",
            signupBtn: "Launch My Journey",
            noAccount: "New here? ",
            hasAccount: "Already part of the network? ",
            createAccount: "Create Account",
            reconnect: "Re-connect"
        },
        challenge: {
            promptWarning: "Important: You must write your prompt in English for the AI to understand, even if the interface is in Polish.",
            submit: "Submit Vibe",
            thinking: "AI is thinking...",
            success: "Challenge Completed!",
            xpEarned: "XP Earned"
        },
        profile: {
            title: "Player Profile",
            memberSince: "Member since",
            level: "Level",
            categoryProgress: "Category Progress",
            achievements: "Achievements",
            completed: "completed",
            unlocked: "Unlocked",
            locked: "Locked",
            account: "Account",
            settings: "Settings",
            logout: "Log Out",
            bestStreak: "Best Streak",
            dayStreak: "Day Streak",
            changeAvatar: "Change Avatar",
            selectAvatar: "Select your vibe avatar",
            cancel: "Cancel",
            save: "Save Changes",
        },
        leaderboard: {
            title: "Leaderboard",
            subtitle: "See how you rank against other vibe coders",
            allTimeRank: "All-Time Rank",
            totalXP: "Total XP",
            challenges: "Challenges",
            allTimeTitle: "All-Time Rankings",
            weeklyTitle: "This Week",
            motivation: "Complete more challenges to climb the ranks! 🚀"
        },
        levels: {
            sprout: "Sprout",
            apprentice: "Apprentice",
            developer: "Developer",
            expert: "Expert",
            master: "Master"
        },
        challenges: {
            'prompt-basics-1': {
                title: 'Your First Prompt',
                description: 'Learn how to write a clear, effective prompt for an AI assistant',
                instructions: 'Write a prompt that asks an AI to explain what "vibe coding" is to a complete beginner. Make it concise and use a friendly tone.'
            },
            'prompt-basics-2': {
                title: 'Context is King',
                description: 'Learn to provide context in your prompts for better results',
                instructions: 'You are building a React component for a weather app. Write a prompt to create a "WeatherCard" component, providing context about the UI style (modern, glassmorphism) and the data it should display (temp, condition, city).'
            },
            'prompt-basics-3': {
                title: 'Breaking Down Tasks',
                description: 'Learn to decompose complex requests into smaller prompts',
                instructions: 'You want to build a simple todo app. Instead of one massive prompt, break it down into 3 smaller, focused prompts.\n\nWrite your first prompt: Create the data structure for a todo item.\nThen think about what the next 2 prompts would be.'
            }
        },
        home: {
            features: {
                learn: { title: 'Learn by Doing', desc: 'Interactive challenges that teach you AI-assisted coding from basics to mastery' },
                compete: { title: 'Earn & Compete', desc: 'Gain XP, unlock achievements, and climb the leaderboards' },
                speed: { title: 'Speed Challenges', desc: 'Race against the clock in timed coding competitions' },
                community: { title: 'Community', desc: 'Learn alongside thousands of developers mastering vibe coding' }
            },
            levels: {
                sprout: { name: 'Sprout', desc: 'Learn the basics of AI prompting' },
                apprentice: { name: 'Apprentice', desc: 'Master intermediate techniques' },
                developer: { name: 'Developer', desc: 'Build real features with AI' },
                expert: { name: 'Expert', desc: 'Handle complex challenges' },
                master: { name: 'Master', desc: 'Full project creation' }
            }
        }
    },
    pl: {
        appName: "Vibe Stranding",
        nav: {
            dashboard: "Panel",
            learn: "Nauka",
            network: "Sieć",
            compete: "Zawody",
            leaderboard: "Ranking",
            profile: "Profil",
            logout: "Wyloguj",
        },
        categories: {
            prompting: "Tworzenie Promptów",
            debugging: "Polowanie na Bugi",
            building: "Budowanie Funkcji",
            refactoring: "Reflektoryzacja",
            speed: "Szybkie Kodowanie"
        },
        hero: {
            title: "Mistrzostwo w",
            subtitle: "Vibe Stranding to rosnący plac zabaw, gdzie możesz cieszyć się i uczyć przyszłości AI. Całkowicie za darmo eksploruj interaktywne wyzwania i opanuj sztukę vibe codingu.",
            cta: "Rozpocznij Podróż",
            login: "Mam już konto"
        },
        dashboard: {
            welcome: "Witaj ponownie, ",
            stillBreathing: "Wciąż oddychasz, ",
            networkStatus: "Status Sieci",
            stats: {
                challenges: "Wyzwania",
                streak: "Seria",
                achievements: "Osiągnięcia",
                totalXp: "Suma XP",
                completed: "ukończonych",
                days: "dni",
                earned: "zdobytych"
            },
            actions: {
                continue: "Kontynuuj Naukę",
                searchStrands: "Szukaj Pasma",
                connections: "połączeń do przywrócenia",
                challengesLeft: "pozostałych wyzwań",
                competition: "Weź udział w zawodach",
                testSkills: "Sprawdź swoje umiejętności na tle innych"
            },
            tips: {
                title: "Pro Tip'y Vibe Codingu",
                survivalTitle: "Przetrwanie Przyszłości",
                tip1: "Kontekst to Król 👑",
                tip1Desc: "Zawsze dostarczaj AI jasne przykłady struktury kodu i swoich celów.",
                tip2: "Iteruj, nie kłóć się 🔄",
                tip2Desc: "Jeśli AI nie łapie klimatu, doprecyzuj polecenie zamiast je powtarzać.",
                tip3: "Sprawdź Aurę ✨",
                tip3Desc: "Nigdy tylko nie kopiuj-wklejaj. Przeczytaj kod, aby upewnić się, że pasuje do duszy projektu.",
                tip4: "Używaj Pseudo-kodu 🧠",
                tip4Desc: "Poproś AI o zarysowanie logiki przed napisaniem jakiejkolwiek implementacji."
            },
            quest: {
                title: "Codzienne Zadanie",
                accept: "Przyjmij Zadanie →",
                enterStorm: "Wejdź w Burzę →"
            }
        },
        auth: {
            loginTitle: "Witaj Ponownie!",
            signupTitle: "Dołącz do Vibe Stranding",
            loginSubtitle: "Kontynuuj swoją podróż",
            signupSubtitle: "Przetrwanie jest lepsze z AI. Rozpocznij swoją podróż.",
            username: "Nazwa użytkownika",
            email: "Adres e-mail",
            password: "Hasło",
            confirmPassword: "Potwierdź hasło",
            loginBtn: "Wejdź w Vibe",
            signupBtn: "Uruchom moją podróż",
            noAccount: "Pierwszy raz tutaj? ",
            hasAccount: "Jesteś już częścią sieci? ",
            createAccount: "Utwórz Konto",
            reconnect: "Połącz ponownie"
        },
        challenge: {
            promptWarning: "Ważne: Musisz napisać polecenie (prompt) po angielsku, aby AI mogło je zrozumieć, nawet jeśli interfejs jest po polsku.",
            submit: "Wyślij Vibe",
            thinking: "Sztuczna Inteligencja myśli...",
            success: "Wyzwanie Ukończone!",
            xpEarned: "Zdobyte XP"
        },
        profile: {
            title: "Profil Gracza",
            memberSince: "Członek od",
            level: "Poziom",
            categoryProgress: "Postęp Kategorii",
            achievements: "Osiągnięcia",
            completed: "ukończonych",
            unlocked: "Odblokowane",
            locked: "Zablokowane",
            account: "Konto",
            settings: "Ustawienia",
            logout: "Wyloguj się",
            bestStreak: "Najlepsza Seria",
            dayStreak: "Dzienna Seria",
            changeAvatar: "Zmień Awatar",
            selectAvatar: "Wybierz swój vibe awatar",
            cancel: "Anuluj",
            save: "Zapisz Zmiany",
        },
        leaderboard: {
            title: "Ranking",
            subtitle: "Sprawdź swoje miejsce wśród innych koderów",
            allTimeRank: "Ranking Ogólny",
            totalXP: "Suma XP",
            challenges: "Wyzwania",
            allTimeTitle: "Ranking Ogólny",
            weeklyTitle: "W Tym Tygodniu",
            motivation: "Ukończ więcej wyzwań, aby wspiąć się w rankingu! 🚀"
        },
        levels: {
            sprout: "Kiełek",
            apprentice: "Czeladnik",
            developer: "Programista",
            expert: "Ekspert",
            master: "Mistrz"
        },
        challenges: {
            'prompt-basics-1': {
                title: 'Twój Pierwszy Prompt',
                description: 'Naucz się pisać jasne i skuteczne polecenia dla asystenta AI',
                instructions: 'Napisz prompt, który prosi AI o wyjaśnienie całkowitemu początkującemu, czym jest "vibe coding". Zrób to zwięźle i użyj przyjaznego tonu.'
            },
            'prompt-basics-2': {
                title: 'Kontekst to Król',
                description: 'Naucz się dostarczać kontekst w swoich promptach dla lepszych rezultatów',
                instructions: 'Budujesz komponent React dla aplikacji pogodowej. Napisz prompt, aby stworzyć komponent "WeatherCard", podając kontekst dotyczący stylu UI (nowoczesny, glassmorphism) oraz danych, które powinien wyświetlać (temperatura, warunki, miasto).'
            },
            'prompt-basics-3': {
                title: 'Rozbijanie Zadań',
                description: 'Naucz się rozkładać złożone prośby na mniejsze polecenia',
                instructions: 'Chcesz zbudować prostą aplikację todo. Zamiast jednego wielkiego promptu, rozbij go na 3 mniejsze, skoncentrowane polecenia.\n\nNapisz swój pierwszy prompt: Stwórz strukturę danych dla elementu todo.\nNastępnie pomyśl, jakie byłyby kolejne 2 prompty.'
            }
        },
        home: {
            features: {
                learn: { title: 'Nauka w Praktyce', desc: 'Interaktywne wyzwania, które uczą kodowania ze wsparciem AI od podstaw do mistrzostwa' },
                compete: { title: 'Zarabiaj i Rywalizuj', desc: 'Zdobywaj XP, odblokowuj osiągnięcia i wspinaj się w rankingu' },
                speed: { title: 'Wyzwania Szybkości', desc: 'Ścigaj się z czasem w turniejach kodowania na czas' },
                community: { title: 'Społeczność', desc: 'Ucz się razem z tysiącami twórców opanowujących vibe coding' }
            },
            levels: {
                sprout: { name: 'Kiełek', desc: 'Poznaj podstawy promptowania AI' },
                apprentice: { name: 'Czeladnik', desc: 'Opanuj pośrednie techniki' },
                developer: { name: 'Programista', desc: 'Buduj prawdziwe funkcje z AI' },
                expert: { name: 'Ekspert', desc: 'Staw czoła złożonym wyzwaniom' },
                master: { name: 'Mistrz', desc: 'Twórz pełne projekty' }
            }
        }
    }
};
