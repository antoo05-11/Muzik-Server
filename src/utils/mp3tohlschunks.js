'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

export const convert = async () => {
    const dir = path.join(__dirname, '../songs');
    const dest = path.join(__dirname, '../temp/chunks');
    const songsConvertedFilePath = path.join(__dirname, '../songsConverted.txt');

    let existingSongs = [];
    try {
        const data = await fs.promises.readFile(songsConvertedFilePath, 'utf-8');
        existingSongs = data.split(',').map(song => song.trim());
    } catch (readFileError) {
        console.log("Init file reader 2: " + readFileError);
    }

    const startTime = new Date();
    console.info('> Start reading files', startTime);

    try {
        const files = await fs.promises.readdir(dir);
        const countFiles = files.length;

        await Promise.all(files.map(async (file, index) => {
            const fileName = path.join(dir, file);

            if (file.toLowerCase() === "meta-data") {
                console.log(`${file} is meta-data. Skipping conversion.`);
                return;
            }

            const isSongConverted = existingSongs.includes(file);
            if (isSongConverted) {
                console.log(`${file} is already converted. Skipping.`);
                return;
            }

            const { err, stdout, stderr } =
                await exec(`ffmpeg -i ${fileName} -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls  ${dest}/${file.replaceAll('.mp3', '')}.m3u8`);

            if (err) {
                console.log(err);
            }

            existingSongs.push(file);

            await fs.promises.writeFile(songsConvertedFilePath, existingSongs.join(', '));

            if (countFiles - 1 === index) {
                const endTime = new Date();
                console.info('< End Preparing files', endTime);
            }
        }));
    } catch (readDirError) {
        console.error(readDirError);
    }
};
