const fs = require('fs');
const findUp = require('find-up');
const execSync = require('child_process').execSync;

function abortIfPackageJsonHasChanges(packageJsonPath) {
  if (run(`git status -s ${packageJsonPath}`).length) {
    throw new UsageError('First, commit your package.json');
  }
}

function bumpVersion(version, upgradeType) {
  let [major, minor, patch] = version.split('.').map(x => parseInt(x, 10));

  switch (upgradeType) {
    case 'major':
      return `${major + 1}.${minor}.${patch}`;

    case 'minor':
      return `${major}.${minor + 1}.${patch}`;

    case 'patch':
      return `${major}.${minor}.${patch + 1}`;

    default:
      return `${major}.${minor}.${patch}`;
  }
}

const packageJsonPath = findUp.sync('package.json');
abortIfPackageJsonHasChanges(packageJsonPath);

const packageJson = require(packageJsonPath);
const { version } = packageJson;
packageJson.version = bumpVersion(version, 'patch');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
