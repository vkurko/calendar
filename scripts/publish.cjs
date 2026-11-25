const {execSync} = require('child_process');

const args = process.argv.slice(2);
if (!args.length) {
    console.log('Error: One-time password is missing');
    return;
}

const otp = args[0];
const packages = require('./packages.json');

// A one-time password can expire before all packages are published. The versions that are already published
// are skipped, so the script can simply be run again with a new password.
for (let name of packages) {
    let dir = __dirname + '/../packages/' + name;
    let {name: pkg, version} = require(dir + '/package.json');
    if (published(pkg, version)) {
        console.log(pkg + '@' + version + ' is already published, skipped');
    } else {
        execSync('npm publish --access public --otp=' + otp, {cwd: dir, stdio: 'inherit'});
    }
}

function published(pkg, version) {
    try {
        // Prints nothing for a version that does not exist, and fails for a package that does not exist
        return execSync('npm view ' + pkg + '@' + version + ' version', {stdio: ['ignore', 'pipe', 'ignore']})
            .toString().trim() === version;
    } catch (e) {
        return false;
    }
}
