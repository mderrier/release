const {Command, flags} = require('@oclif/command')
const url = require('url')
const semver = require('semver')
const readPkgUp = require('read-pkg-up')
const  { RELEASE_TYPES } = require('../helpers/constants')
const execa = require('execa')
class PrepareCommand extends Command {
  async run() {
    const {flags} = this.parse(PrepareCommand)
    const name = flags.name || 'world'
    this.releaseVersion = flags.bumped || 'patch'
    const { pkg, path: pkgPath } = await readPkgUp();
    this.pkg = pkg
    //const releaseVersion = await this.getReleaseVersion(pkg.version)
    await this.validatingVersion()
    await this.checkGitTagExistence()
    //this.log(this.releaseVersion)
  }

  async validatingVersion() {

    if (!semver.valid(this.releaseVersion)) {
      throw new Error(`Version should be either ${RELEASE_TYPES.join(', ')}, or a valid semver version.`);
    }

    if (semver.gte(this.pkg.version, this.releaseVersion)) {
      throw new Error(`New version \`${this.releaseVersion}\` should be higher than current version \`${this.pkg.version}\`.`);
    }

    if (semver.prerelease(this.releaseVersion) && !options.tag) {
      throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
    }
  }

  async checkGitTagExistence() {
    try {
      await execa('git', ['fetch']);
    }
    catch (error) {
      if (error.message.match(/No remote repository specified/)) {
        let upstreamUrl = (this.pkg.repository && this.pkg.repository.url) || false;

        if (upstreamUrl) {
          upstreamUrl = url.format({ ...url.parse(upstreamUrl), protocol: 'https' });
          throw new Error(`No remote repository configured. Run \`git remote add origin ${upstreamUrl}; git push -u origin master\``);
        }

        throw new Error('No remote repository configured.');
      }

      throw error;
    }

    let hasTag = false;
    try {
      hasTag = !!(await execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/v${this.releaseVersion}`]));
    }
    catch (error) {
      // Do nothing
    }

    if (hasTag) {
      throw new Error(`Git tag \`v${this.releaseVersion}\` already exists.`);
    }
  
  }
}


PrepareCommand.description = `
Describe the command here
...
Extra documentation goes here
`

PrepareCommand.flags = {
  bumped: flags.string({char: 'b', description: 'name to print'}),
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = PrepareCommand
