/**
 * Node exclusivement
 */

import * as fs from 'fs';
import * as path from 'path';
import { isNode } from './envUtils';

if (!isNode) {
    throw new Error('File operations can only be performed in Node environment');
}

const GENERATED_FOLDER_RELATIVE_PATH = '../../generated';

function processFilename(fileName: string): string {
    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    return fileName;
}

function getFolderPath(fileName: string): string {
    return path.join(__dirname, GENERATED_FOLDER_RELATIVE_PATH, fileName);
}

export async function writeJson(json: object, fileName: string): Promise<void> {
    let text = JSON.stringify(json);
    let filePath = getFolderPath(processFilename(fileName));

    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, text, {
            encoding: 'utf8'
        }, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

    return 
}

export async function readJson<T>(fileName: string): Promise<T> {
    let filePath = getFolderPath(processFilename(fileName));

    return new Promise<T>((resolve, reject) => {
        fs.readFile(filePath, {
            encoding: 'utf8'
        }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            let content = JSON.parse(data) as T;
            resolve(content);
        });
    });
}