
/**
 * Runs a callback in the context of a try/catch block
 * All functions are ran and resolved in the context of a promise
 * So, you can use async or sync functions
 *
 * @param callback The function to be executed
 * @returns The value of the callback or null if an error is thrown
 */
export async function tryCatch(callback: () => Promise<any>): Promise<any> {
    try {
        return await Promise.resolve(callback());
    } catch (error) {
        console.error(error);
        return Promise.reject(null);
    }
}

