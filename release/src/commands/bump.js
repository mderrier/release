const {Command, flags} = require('@oclif/command')
const {promisify} = require('util')
const execa = require('execa')
const semver = require('semver')
const readPkgUp = require('read-pkg-up')
const writePkg = require('write-pkg')
const { RELEASE_TYPES } = require('../helpers/constants')
const conventionalRecommendedBump = require('conventional-recommended-bump');

const getRecommendedBump = promisify(conventionalRecommendedBump)

class BumpCommand extends Command {
  async run() {
    const {flags} = this.parse(BumpCommand)
    const name = flags.name || 'world'
    const { pkg, path: pkgPath } = await readPkgUp({normalize: false});
    const releaseVersion = await this.getReleaseVersion(pkg.version)
    console.log(releaseVersion)
    await writePkg(pkgPath, { ...pkg, version: releaseVersion });
  }

  async getReleaseVersion(currentVersion) {
    let releaseType = 'patch';
  
      releaseType = (
        await getRecommendedBump({ preset: 'angular' })
      ).releaseType;
    
    if (!RELEASE_TYPES.includes(releaseType)) {
      return releaseType;
    }
  
    return semver.inc(currentVersion, releaseType);
  }

}

BumpCommand.description = `
Describe the command here
...
Extra documentation goes here
`

BumpCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = BumpCommand
