export type basicFetchProps = {
    method: string;
    headers: Headers;
};


export async function _fetch(
    { method, headers }: basicFetchProps,
    endpoint: string,
    hasBody: boolean,
    prefix = '',
    body = {}
) {

    const routes = [prefix, endpoint].join('/');

    try {
        const response = await fetch(routes, !hasBody ? {
            method,
            headers
        } : {
            method,
            headers,
            body: JSON.stringify({ ...body })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { error };
    }
}

export async function _query(endpoint: string, headers: Headers, prefix: string) {
    return _fetch(
        {
            method: 'GET',
            headers
        },
        endpoint, false, prefix
    );
}

export async function _mutate(
    endpoint: string,
    method: string,
    body: object,
    headers: Headers,
    prefix: string
) {

    return _fetch(
        {
            headers,
            method
        },
        endpoint, true, prefix, body
    );
}
