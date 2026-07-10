import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import type { OAuthConfig } from "next-auth/providers/oauth";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

// Extended LinkedIn profile type
interface LinkedInProfile {
    sub: string;
    name: string;
    email: string;
    picture: string;
    vanityName?: string;
    id?: string;
}

// Custom LinkedIn OIDC Provider with extended profile fetch
function CustomLinkedInProvider(): OAuthConfig<LinkedInProfile> {
    return {
        id: "linkedin",
        name: "LinkedIn",
        type: "oauth",
        clientId: requireEnv("LINKEDIN_CLIENT_ID"),
        clientSecret: requireEnv("LINKEDIN_CLIENT_SECRET"),
        authorization: {
            url: "https://www.linkedin.com/oauth/v2/authorization",
            params: {
                // Using OIDC scopes only - add r_basicprofile when Advertising API is approved
                scope: "openid profile email",
                response_type: "code",
                prompt: "login", // Force re-authentication
            },
        },
        token: {
            url: "https://www.linkedin.com/oauth/v2/accessToken",
            async request({ client, params, checks, provider }) {
                const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        code: params.code as string,
                        redirect_uri: provider.callbackUrl,
                        client_id: provider.clientId as string,
                        client_secret: provider.clientSecret as string,
                    }),
                });

                const tokens = await response.json();
                return { tokens };
            },
        },
        userinfo: {
            url: "https://api.linkedin.com/v2/userinfo",
            async request({ tokens }) {
                // Get basic userinfo from OIDC endpoint
                const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
                    headers: { Authorization: `Bearer ${tokens.access_token}` },
                });
                const userinfo = await userinfoRes.json();

                // Fetch full profile including vanityName from /v2/me
                try {
                    const meRes = await fetch(
                        "https://api.linkedin.com/v2/me?projection=(id,vanityName,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
                        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
                    );

                    if (meRes.ok) {
                        const meData = await meRes.json();

                        // Extract high-res profile picture if available
                        let profilePicture = userinfo.picture;
                        try {
                            if (meData.profilePicture && meData.profilePicture['displayImage~'] && meData.profilePicture['displayImage~'].elements) {
                                const elements = meData.profilePicture['displayImage~'].elements;
                                // The last element is usually the largest/best resolution
                                if (elements.length > 0) {
                                    const lastElement = elements[elements.length - 1];
                                    if (lastElement.identifiers && lastElement.identifiers.length > 0) {
                                        profilePicture = lastElement.identifiers[0].identifier;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing LinkedIn profile picture:", e);
                        }

                        return {
                            ...userinfo,
                            picture: profilePicture, // Override with high-res image
                            vanityName: meData.vanityName,
                            id: meData.id,
                        };
                    } else {
                        console.error("LinkedIn /v2/me error:", meRes.status, await meRes.text());
                    }
                } catch (e) {
                    console.error("Failed to fetch LinkedIn /v2/me:", e);
                }

                return userinfo;
            },
        },
        profile(profile) {
            return {
                id: profile.sub || profile.id || "",
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            };
        },
    };
}

const handler = NextAuth({
    secret: requireEnv("NEXTAUTH_SECRET"),
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days — this only gates guestbook posting, not sensitive data
    },
    providers: [
        CustomLinkedInProvider(),

        GitHubProvider({
            clientId: requireEnv("GITHUB_ID"),
            clientSecret: requireEnv("GITHUB_SECRET"),
            authorization: {
                params: {
                    prompt: "login", // Force re-authentication
                }
            },
            profile(profile) {
                return {
                    id: String(profile.id),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                };
            },
        }),
    ],
    pages: {
        signIn: "/connect",
        error: "/connect",
    },
    callbacks: {
        async signIn() {
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.picture = user.image;
            }
            if (account?.provider) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.image = token.picture;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
