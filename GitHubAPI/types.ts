export type authHeaders = {
    'Authorization': string;
    'Content-Type': string;
};

export type repoByName = {
    name: string,
    html_url: string,
    description: string,
    language: string,
    created_at: string,
    updated_at: string,
    open_issues: string,
    clone_url: string,
    size: number,
    commits_url: string,
    license: { name: string }
};
