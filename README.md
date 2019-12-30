# @softoika/schematics

A miscellaneous schematics collection for Angular.

- Injectable class schematic

The other schematics will be added soon.

## Getting started

Install this package to execute the schematics

```
npm install -D @softoika/schematics
```

### Injectable class schematic

This schematic is a service schematic that can be given any name instead of service.
For example, the following command creates a service class as a repository.

```bash
$ ng generate @softoika/schematics:injectable user --type repository
# or
$ ng g @softoika/schematics:ij user -t repository
CREATE src/app/user.repository.spec.ts (345 bytes)
CREATE src/app/user.repository.ts (137 bytes)
```
