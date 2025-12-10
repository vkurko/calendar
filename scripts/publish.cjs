const {execSync} = require('child_process');

const args = process.argv.slice(2);
if (!args.length) {
    console.log('Error: One-time password is missing');
    return;
}

const otp = args[0];
const packages = require('./packages.json');

for (let name of packages) {
    publish(__dirname + '/../packages/' + name);
}

function publish(dir) {
    execSync('cd ' + dir + ' && npm publish --access public --otp=' + otp);
}
