
const {Command, flags} = require('@oclif/command')
const {promisify} = require('util')
const execa = require('execa')
const path = require('path')
const readPkgUp = require('read-pkg-up')


class ChangelogCommand extends Command {

  async run() {
    const {flags} = this.parse(ChangelogCommand)
    const name = flags.name || 'world'
    const { pkg, path: pkgPath } = await readPkgUp({normalize: false});
    this.releaseVersion = pkg.version
    const changelogPath = path.join(path.dirname(pkgPath), 'CHANGELOG.md');
    await execa('conventional-changelog', [
      '--infile', changelogPath, '--same-file', '--preset', 'angular', '--release-count', 0,
    ]);
    if ((await execa.stdout('git', ['status', '--porcelain', '--', changelogPath])).trim().length === 0) {
      await execa('git', ['add', changelogPath]);
      const commitMessage = 'Update CHANGELOG.md';
      await execa('git' , ['commit', '-m', `"${commitMessage}"`]);
      await execa('git', ['push']);
    }
    await this.commitRelease(pkgPath)
  }

  async commitRelease(pkgPath) {
    const isExist = await execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/v${this.releaseVersion}`])
    if (isExist) throw new Error(`Git tag \`v${this.releaseVersion}\` already exists.`)
    await execa('git', ['add', pkgPath]);
    await execa('git', ['commit', '--message', `Release v${this.releaseVersion}`]);
    await execa('git', ['tag', '--annotate', '--message', `Release v${this.releaseVersion}`, `v${this.releaseVersion}`]);
    await execa('git', ['push', '--tags'])
  }
}

ChangelogCommand.description = `
Describe the command here
...
Extra documentation goes here
`

ChangelogCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ChangelogCommand

