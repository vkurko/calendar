const fs = require('fs');

const args = process.argv.slice(2);
if (!args.length) {
    console.log('Error: Version is missing');
    return;
}

const version = args[0];
const packages = require('./packages.json');

let dir = __dirname + '/..';
setVersion(dir);

for (let name of packages) {
    dir = __dirname + '/../packages/' + name;
    setVersion(dir);
}

function setVersion(dir) {
    const file = dir + '/package.json';
    const json = require(file);

    json.version = version;
    for (let name of packages) {
        name = '@event-calendar/' + name;
        if (json.dependencies && json.dependencies[name]) {
            json.dependencies[name] = '~' + version;
        }
        if (json.devDependencies && json.devDependencies[name]) {
            json.devDependencies[name] = '~' + version;
        }
    }

    fs.writeFileSync(file, JSON.stringify(json, null, 2));
}