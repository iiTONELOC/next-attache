import { authHeaders } from './types';

export function headers(_authToken = ''): authHeaders {
    return {
        'Authorization': `bearer ${_authToken}`,
        'Content-Type': 'application/json'
    };
}