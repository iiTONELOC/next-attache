export type authHeaders = {
    'Authorization': string;
    'Content-Type': string;
};

export type repoByName = {
    name: string,
    htmlUrl: string,
    description: string,
    language: string,
    createdAt: string,
    updatedAt: string,
    openIssues: string,
    cloneUrl: string,
    size: number,
    commitUrl: string,
    repoUrl: string,
    license: { name: string } | null,
};
