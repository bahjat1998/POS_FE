import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';
import unzipper from 'unzipper';
import { dialog } from 'electron';
import extract from 'extract-zip';

const FILE_ID = '1UMEvdEENEl6fr5OkyA7RmAI_TLPwspxX'; // <-- Replace with your actual file ID
const ZIP_NAME = 'NewClick_POS_Setup_0.6.8.exe.zip';
const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const ZIP_PATH = path.join(DOWNLOADS_DIR, ZIP_NAME);
const EXTRACT_DIR = path.join(DOWNLOADS_DIR, 'NewClickPOS');

function downloadLargeFile (fileId, destPath, callback, onError) {
    const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    console.log('baseurl', baseUrl);
    https
        .get(baseUrl, res => {
            // Case 1: If content-disposition exists, file is ready to download directly
            const disposition = res.headers['content-disposition'];
            if (disposition && disposition.includes('attachment')) {
                const file = fs.createWriteStream(destPath);
                res.pipe(file);
                file.on('finish', () => file.close(callback));
                return;
            }

            // Case 2: Intercept the body to find confirm token
            let body = '';
            res.on('data', chunk => (body += chunk.toString()));
            res.on('end', () => {
                //   const tokenMatch = body.match(/confirm=([0-9A-Za-z_]+)&amp;/);
                //   if (!tokenMatch) {
                //     return onError(new Error('Could not retrieve confirmation token from Google.'));
                //   }

                //   const confirmToken = tokenMatch[1];
                const finalUrl = `https://drive.usercontent.google.com/download?id=1UMEvdEENEl6fr5OkyA7RmAI_TLPwspxX&export=download&authuser=0&confirm=t&uuid=1c40b8de-23bb-4352-9bcf-bfa2d0e1382c&at=AN8xHork1WBDWdVjPaNo74lh2fvX%3A1751754693601`;

                https
                    .get(finalUrl, finalRes => {
                        const file = fs.createWriteStream(destPath);
                        finalRes.pipe(file);
                        file.on('finish', () => file.close(callback));
                    })
                    .on('error', onError);
            });
        })
        .on('error', onError);
}

export async function downloadAndExtract (win) {
    dialog.showMessageBox(win, {
        type: 'info',
        message: 'Downloading the latest version of NewClick POS...'
    });

    downloadLargeFile(
        FILE_ID,
        ZIP_PATH,
        async () => {
            try {
                dialog.showMessageBox(win, {
                    type: 'info',
                    message: 'Download complete. Extracting now...'
                });

                await extract(ZIP_PATH, { dir: EXTRACT_DIR });

                dialog.showMessageBox(win, {
                    type: 'info',
                    message: `Extraction complete.\n\nSaved to:\n${EXTRACT_DIR}`
                });
            } catch (error) {
                dialog.showErrorBox('Extraction Error', error.message);
            }
        },
        err => {
            dialog.showErrorBox('Download Error', err.message);
        }
    );
}
