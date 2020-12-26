/**
 * Code inspiré de @see https://github.com/flexdinesh/browser-or-node
 */

export enum Environment {
    NODE,
    BROWSER
}

function getEnvironment(): Environment {
    if (typeof window !== 'undefined'
        && typeof window.document !== 'undefined') {
        return Environment.BROWSER;
    } else if (typeof process !== 'undefined'
        && process.versions != null
        && process.versions.node != null) {
        return Environment.NODE;
    }
    throw new Error("Unknown environment");
}

export const env: Environment = getEnvironment();
export const isBrowser: boolean = env === Environment.BROWSER;
export const isNode: boolean = env === Environment.NODE;