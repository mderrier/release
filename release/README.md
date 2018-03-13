release
=======

release command

[![Version](https://img.shields.io/npm/v/release.svg)](https://npmjs.org/package/release)
[![CircleCI](https://circleci.com/gh/mderrier/release/tree/master.svg?style=shield)](https://circleci.com/gh/mderrier/release/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/mderrier/release?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/release/branch/master)
[![Codecov](https://codecov.io/gh/mderrier/release/branch/master/graph/badge.svg)](https://codecov.io/gh/mderrier/release)
[![Greenkeeper](https://badges.greenkeeper.io/mderrier/release.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/mderrier/release/badge.svg)](https://snyk.io/test/github/mderrier/release)
[![Downloads/week](https://img.shields.io/npm/dw/release.svg)](https://npmjs.org/package/release)
[![License](https://img.shields.io/npm/l/release.svg)](https://github.com/mderrier/release/blob/master/package.json)

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- install -->
# Install

with yarn:
```
$ yarn global add release
```

or with npm:
```
$ npm install -g release
```
<!-- installstop -->
<!-- usage -->
# Usage

```sh-session
$ release COMMAND
running command...
$ release (-v|--version|version)
release/0.0.0 (darwin-x64) node-v9.5.0
$ release --help [COMMAND]
USAGE
  $ release COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [release hello](#hello)
* [release help [COMMAND]](#help-command)
## hello

Describe the command here

```
USAGE
  $ release hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  Describe the command here
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/mderrier/release/blob/v0.0.0/src/commands/hello.js)_

## help [COMMAND]

display help for release

```
USAGE
  $ release help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.1.5/src/commands/help.ts)_
<!-- commandsstop -->
