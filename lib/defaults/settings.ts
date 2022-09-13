
export interface DefaultUserSettings {
    name?: string;
    email?: string;
    phone?: string;
    about?: string;
    navHeading?: string;
    portfolioTitle?: string;
    // used to override GitHub's default pinned projects for the portfolio
    pinnedProjects?: string[];
}

export interface GitHubSettings {
    username: string;
    authenticate: string;
}
