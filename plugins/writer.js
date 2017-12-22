const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function writer(opts) {
    return (flowObj) => {
        const { conf, filepath, result } = flowObj || {};

        let outputPath = './';
        if (typeof opts === 'function') {
            outputPath = opts(filepath);
        }
        else if (typeof opts === 'string') {
            outputPath = opts;
        }
        else if (typeof opts === 'object') {
            outputPath = opts.path;
        }

        const outputDir = path.dirname(outputPath);

        return new Promise((resolve, reject) => {
            if (!flowObj) {
                return resolve();
            }

            const write = () => {
                fs.writeFile(outputPath, result, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
            };

            // Ensure the directory exists
            if (!fs.existsSync(outputDir)) {
                mkdirp(outputDir, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    write();
                });
            } else {
                write();
            }
        });
    };
};
