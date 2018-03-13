const {Command, flags} = require('@oclif/command')
const execa = require('execa')

class ValidateCommand extends Command {
  async run() {
    const {flags} = this.parse(ValidateCommand)
    const name = flags.name || 'world'
    await this.validateGithubToken();
    await this.checkGitRepository()
    await this.checkGitRemote()
    await this.validateBranch()
    await this.validateInSyncWithRemote()
    //await this.validateLocalWorkingTree()
  }

  async validateGithubToken() {
    if (process.env.GITHUB_TOKEN == undefined) throw new Error("The GitHub token is invalid")
  }

  async checkGitRepository() {
    this.log('Check git repository')
    try {
      await execa('git', ['rev-parse', 'HEAD']);
    }
    catch (error) {
      if (error.message.match(/Not a git repository/)) {
        throw new Error('Not a git repository. Run `git init`.');
      }
      if (error.message.match(/ambiguous argument/)) {
        throw new Error('Empty repository. Commit changes first.');
      }
      throw error;
    }
  }

  async checkGitRemote() {
    this.log('Check git remote')
    await execa.stdout('git', ['ls-remote', 'origin', 'HEAD']).catch(err => {
      throw new Error(err.stderr.replace('fatal:', 'Git fatal error:'))
    })
  }

  async validateBranch() {
    // ENFORCE BRANCH
      this.log('Validate branch');
      const branch = await execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']);
      if (branch !== 'master') {
        throw new Error(`You must be on "master" branch to perform this task. Aborting.`);
      }

  };
  
  async validateLocalWorkingTree() {
    // ENFORCE NO UNCOMMITTED OR UNTRACKED CHANGES
      this.log('Validate uncommitted changes');
      const status = await execa.stdout('git', ['status', '--porcelain']);
      if (status !== '') {
        throw new Error('Unclean working tree. Commit or stash changes first.');
      }
  }
  
  
  async validateInSyncWithRemote() {
    // ENFORCE SYNC WITH REMOTE
      this.log('Validate sync with remote');
  
      await execa('git' , ['fetch']);
  
      const LOCAL = (await execa.stdout('git', ['rev-parse', '@'], { encoding: 'utf8' })).trim();
      const REMOTE = (await execa.stdout('git', ['rev-parse', '@{u}'], { encoding: 'utf8' })).trim();
      const BASE = (await execa.stdout('git', ['merge-base', '@', '@{u}'], { encoding: 'utf8' })).trim();
  
      if (LOCAL !== REMOTE && LOCAL === BASE) {
        throw new Error('Your local branch is out-of-date. Please pull the latest remote changes. Aborting.');
      } else if (LOCAL !== REMOTE && REMOTE === BASE) {
        throw new Error('Your local branch is ahead of its remote branch. Please push your local changes. Aborting.');
      } else if (LOCAL !== REMOTE) {
        throw new Error('Your local and remote branches have diverged. Please put them in sync. Aborting.');
      }
    
  }

}

ValidateCommand.description = `
Describe the command here
...
Extra documentation goes here
`

ValidateCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ValidateCommand
