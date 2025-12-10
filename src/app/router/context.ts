import type { User } from "@auth0/auth0-react";

let userCache: User | null = null;

export function setAuthUser(user: User | null) {
    userCache = user;
}

export function getAuthUser() {
    return userCache;
}
