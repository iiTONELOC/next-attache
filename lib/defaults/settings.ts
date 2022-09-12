
export interface DefaultUserSettings {
    name?: string;
    email?: string;
    phone?: string;
    portfolioTitle?: string;
    portfolioDescription?: string;
    portfolioImage?: string;
    // used to override GitHub's default pinned projects for the portfolio
    pinnedProjects?: string[];
}

export interface GitHubSettings {
    username: string;
    authenticate: string;
}
