const fs = require('fs');

const args = process.argv.slice(2);
if (!args.length) {
    console.log('Error: Version is missing');
    return;
}

const version = args[0];
const packages = require('./packages.json');

let file = __dirname + '/../package.json';
setVersion(file);

for (let name of packages) {
    const file = __dirname + '/../packages/' + name + '/package.json';
    setVersion(file);
}

function setVersion(file) {
    const json = require(file);

    json.version = version;
    for (let dep of packages) {
        dep = '@event-calendar/' + dep;
        if (json.dependencies && json.dependencies[dep]) {
            json.dependencies[dep] = '~' + version;
        }
        if (json.devDependencies && json.devDependencies[dep]) {
            json.devDependencies[dep] = '~' + version;
        }
    }

    fs.writeFileSync(file, JSON.stringify(json, null, 2));
}