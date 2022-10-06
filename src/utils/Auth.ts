import { JwtPayload } from 'jsonwebtoken';
import decode from 'jwt-decode';

export type Auth = {
    logout: () => void;
    login: (token: string) => void;
    getToken: () => string | null;
    getProfile: () => string | null;
    isTokenExpired: (token: string) => boolean;
};

class AuthService {
    #tokenName: string;

    constructor(tokenName: string) {
        this.#tokenName = tokenName;
    }

    getProfile(): string | null {
        try {
            const token = this.getToken();
            return token ? decode(token) : null;
        } catch (error) {
            return null;
        }
    }

    loggedIn(): boolean {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // check if the token has expired
    isTokenExpired(token: string): boolean {
        try {
            const decoded: JwtPayload | null | undefined = decode(token);
            const oneThousand = 1000;
            const exp = decoded?.exp;
            if (exp && exp < Date.now() / oneThousand) {
                this.clearToken();
                return true;
            } else {
                // token is not expired
                return false;
            }
        } catch (err) {
            // error, default should be to deny access
            return true;
        }
    }

    // retrieve token from localStorage
    getToken(): string | null {
        // Retrieves the user token from localStorage
        if (typeof window !== 'undefined') {
            return localStorage?.getItem(this.#tokenName);
        }
        return null;
    }

    // set token to localStorage and reload page to homepage
    login(token: string) {

        const timeToWaitInMs = 250;

        if (token && typeof token === 'string' && !this.isTokenExpired(token)) {
            localStorage.setItem(this.#tokenName, token);

            setTimeout(() => {
                window.location.assign(`/admin/dashboard`);
                return true;
            }, timeToWaitInMs);
        }
    }

    clearToken() {
        localStorage?.removeItem(this.#tokenName);
    }

    // clear token from localStorage and force logout with reload
    logout() {
        // Clear user token and profile data from localStorage
        this.clearToken();
        window.location.assign(`/`);
    }

    forceSignIn() {
        this.clearToken();
        window.location.assign(`/admin/login`);
    }
}

export default new AuthService('git_portfolio_token');
