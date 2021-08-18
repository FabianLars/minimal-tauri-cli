#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { spawn } = require('child_process');

const extension = process.platform === 'win32' ? '.exe' : '';
const targetPath = `${__dirname}/bin/tauri-cli${extension}`;

const args = process.argv || [];
args.splice(0, 2);

const main = async () => {
    if (!fs.existsSync(targetPath)) {
        const version = require('./package.json').version;
        let platform = process.platform;

        if (platform === 'win32') {
            platform = 'windows';
        } else if (platform === 'linux') {
            platform = 'linux';
        } else if (platform === 'darwin') {
            platform = 'macos';
        } else {
            throw Error('Unsupported platform');
        }

        let url = `https://github.com/tauri-apps/binary-releases/releases/download/tauri-cli-v1.0.0-beta.6/tauri-cli_${platform}${extension}`;

        console.log('Downloading Rust CLI...');

        fs.mkdirSync(`${__dirname}/bin`, { recursive: true });
        const file = fs
            .createWriteStream(targetPath, { mode: 0o700 })
            .on('finish', () => {
                file.close(() => {
                    const child = spawn(targetPath, ['tauri', ...args], {
                        cwd: process.cwd(),
                        stdio: 'inherit',
                    });

                    child.on('close', code => {
                        console.log(`child process exited with code ${code}`);
                    });
                });
            })
            .on('error', e => {
                fs.unlink(targetPath, () => {});
                throw e;
            });

        // Nested requests, as the first one is always a redirect.
        https.get(url, res1 => {
            https
                .get(res1.headers.location || url, res => {
                    if (res.statusCode === 200) {
                        res.pipe(file);
                    } else {
                        file.close();
                        fs.unlink(targetPath, () => {});
                        throw `Server responded with ${res.statusCode}: ${res.statusMessage}`;
                    }
                })
                .on('error', e => {
                    file.close();
                    fs.unlink(targetPath, () => {});
                    throw e;
                });
        });
    } else {
        const child = spawn(targetPath, ['tauri', ...args], {
            cwd: process.cwd(),
            stdio: 'inherit',
        });

        child.on('close', code => {
            console.log(`child process exited with code ${code}`);
        });
    }
};

main().catch(e => {
    throw e;
});
