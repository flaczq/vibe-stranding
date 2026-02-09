import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
            const isProtectedPage = nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/learn") ||
                nextUrl.pathname.startsWith("/compete") ||
                nextUrl.pathname.startsWith("/profile") ||
                nextUrl.pathname.startsWith("/admin");

            if (isProtectedPage) {
                if (isLoggedIn) {
                    // if (!auth.user.emailVerified) return Response.redirect(new URL("/verify", nextUrl));
                    return true;
                }
                return false; // Redirect to login
            }

            if (isAuthPage && isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
    },
    providers: [], // Basic providers list, will be extended in auth.ts
} satisfies NextAuthConfig;
