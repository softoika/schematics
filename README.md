# @softoika/schematics

[![npm version](https://badge.fury.io/js/%40softoika%2Fschematics.svg)](https://badge.fury.io/js/%40softoika%2Fschematics)
[![Actions Status](https://github.com/softoika/schematics/workflows/Node%20CI/badge.svg)](https://github.com/softoika/schematics/actions?query=workflow%3A%22Node+CI%22)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

A miscellaneous schematics collection for Angular.

- Injectable class schematic (something like service and class schematics combined)
- Interceptor schematic

The other schematics will be added soon.

## Getting started

Install this package to execute the schematics

```
npm install -D @softoika/schematics
```

### Injectable class schematic

This schematic is a service schematic that can be given any name instead of service.
For example, the following command creates a service class whose name is repository.

```bash
$ ng g @softoika/schematics:injectable user --type repository
# or
$ ng g @softoika/schematics:ij user -t repository
CREATE src/app/user.repository.spec.ts (345 bytes)
CREATE src/app/user.repository.ts (137 bytes)
```

And the other options are available.
```
$ ng g @softoika/schematics:injectable --help
...
Help for schematic @softoika/schematics:injectable

arguments:
  name
    The prefix name of the injectable class.

options:
  --flat
    When true (the default), creates files at the top level of the project.
  --lint-fix
    When true, applies lint fixes after generating the injectable class.
  --project
    The name of the project
  --skip-tests
    When true, does not create "spec.ts" test file.
  --type (-t)
    The suffix name of the injectable class. (default: service)
```

## Interceptor schematic
This schematic creates a new generic interceptor definition that implements [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor).

```bash
$ ng g @softoika/schematics:interceptor auth
# or
$ ng g @softoika/schematics:ic auth
CREATE /auth.interceptor.ts (385 bytes)
```

The options same as the service schematic except for --skip-test are available.
```
$ ng g @softoika/schematics:interceptor --help
...
Help for schematic @softoika/schematics:interceptor
Creates a new generic interceptor definition in the given or default project.
arguments:
  name
    The name of the interceptor

options:
  --flat
    When true (the default), creates files at the top level of the project.
  --lint-fix
    When true, applies lint fixes after generating the interceptor.
  --project
    The name of the project
```
