//npm start

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'appsettings.json');
const outputFilePath = path.join(__dirname, 'configmap.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const appSettings = JSON.parse(data);
        // console.log(appSettings);

        const transformData = (obj, parentKey = '') => {
            return Object.keys(obj).reduce((acc, key) => {
                const newKey = parentKey ? `${parentKey}__${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    acc.push(transformData(obj[key], newKey));
                } else {
                    acc.push(`${newKey}=${obj[key]}`);
                }
                return acc;
            }, []).join('\n');
        };

        const transformedData = transformData(appSettings);

        fs.writeFile(outputFilePath, transformedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File has been saved as configmap.txt');
        });
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});