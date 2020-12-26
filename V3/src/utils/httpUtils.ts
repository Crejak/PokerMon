import { env, isBrowser, isNode } from "./envUtils";

// Node imports
const nodeHttps = isNode ? require('https') : undefined;
// import * as nodeHttps from 'https';

export interface HttpGetterOptions {
    logging?: boolean,
    params?: object
}

const DEFAULT_OPTIONS: HttpGetterOptions = {
    logging: false,
    params: undefined
}

export async function httpGet(url: string, options?: HttpGetterOptions): Promise<object> {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    
    let urlObject = new URL(processUrl(url));
    if (!!options.params) {
        urlObject.search = new URLSearchParams(options.params as URLSearchParams).toString();
    }

    if (isNode) {
        return nodeHttpGet(urlObject.toString(), options);
    } else if (isBrowser) {
        return browserHttpGet(urlObject.toString(), options);
    }

    throw new Error('Unknown environment: unable to send http request');
}

async function browserHttpGet(url: string, options: HttpGetterOptions): Promise<object> {
    if (!isBrowser) {
        throw new Error('Wrong environment: this function call only be called in browser');
    }
    
    let response = await fetch(url);
    let json = await response.json();

    if (options.logging) {
        console.info(`GET ${url}`);
    }

    return json;
}

async function nodeHttpGet(url: string, options: HttpGetterOptions): Promise<object> {
    if (!isNode) {
        throw new Error('Wrong environment: this function call only be called in browser');
    }

    return new Promise<object>((resolve, reject) => {
        nodeHttps.get(url, (res) => {
            let responseText = '';
            res.on('data', data => {
                responseText += data;
            });
            res.on('error', error => {
                console.error('============== Error message : ' + error.message);
                console.error(error);
                reject(error);
            });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(res);
                    return;
                }
                let json = JSON.parse(responseText);

                if (options.logging) {
                    console.info(`GET ${url}`);
                }

                resolve(json);
            })
        }).on('error', (error) => {
            console.error('============== Error request : ' + error.message);
            console.error(error);
            reject(error);
        });
    })
}

function processUrl(url: string): string {
    if (url.endsWith("/")) {
        url = url.substring(0, url.length - 1);
    }

    return url;
}