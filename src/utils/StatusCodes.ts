class HttpStatus {
    static readonly OK: number = 200;
    static readonly CREATED: number = 201;
    static readonly ACCEPTED: number = 202;
    static readonly NO_CONTENT: number = 204;
    static readonly BAD_REQUEST: number = 400;
    static readonly UNAUTHORIZED: number = 401;
    static readonly FORBIDDEN: number = 403;
    static readonly NOT_FOUND: number = 404;
    static readonly CONFLICT: number = 409;
    static readonly INTERNAL_SERVER_ERROR: number = 500;
}

export default HttpStatus;
