import { authHeaders } from './types';

/* istanbul ignore next */
export function headers(_authToken = ''): authHeaders {
    return {
        'Authorization': `bearer ${_authToken}`,
        'Content-Type': 'application/json'
    };
}
