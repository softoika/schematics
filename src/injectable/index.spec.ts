import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { InjectableOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('Injectable Schematic', () => {
  it('should create injectable class files', () => {
    const options: InjectableOptions = { name: 'user', type: 'repository' };
    const tree = runner.runSchematic('injectable', options);
    expect(tree.files).toContain('/user.repository.ts');
    expect(tree.readContent('/user.repository.ts')).toEqual(
      "import { Injectable } from '@angular/core';\n" +
        '\n' +
        '@Injectable({\n' +
        "  providedIn: 'root'\n" +
        '})\n' +
        'export class UserRepository {\n' +
        '\n' +
        '  constructor() { }\n' +
        '}\n\n'
    );
    expect(tree.files).toContain('/user.repository.spec.ts');
    expect(tree.readContent('/user.repository.spec.ts')).toEqual(
      "import { TestBed } from '@angular/core/testing';\n" +
        '\n' +
        "import { UserRepository } from './user.repository';\n" +
        '\n' +
        "describe('UserRepository', () => {\n" +
        '  beforeEach(() => TestBed.configureTestingModule({}));\n' +
        '\n' +
        "  it('should be created', () => {\n" +
        '    const repository: UserRepository = TestBed.get(UserRepository);\n' +
        '    expect(repository).toBeTruthy();\n' +
        '  });\n' +
        '});\n' +
        '\n'
    );
  });

  it('should create files as service class without --type option', () => {
    const options: InjectableOptions = { name: 'user' };
    const tree = runner.runSchematic('injectable', options);
    expect(tree.files).toContain('/user.service.ts');
    expect(tree.files).toContain('/user.service.spec.ts');

    expect(tree.readContent('/user.service.ts')).toContain('UserService');

    const specContent = tree.readContent('/user.service.spec.ts');
    expect(specContent).toContain(
      "import { UserService } from './user.service'"
    );
    expect(specContent).toContain(
      'const service: UserService = TestBed.get(UserService);'
    );
  });

  it('should create files in the path if name is provided with path', () => {
    const options: InjectableOptions = { name: 'foo/user', type: 'repository' };
    const tree = runner.runSchematic('injectable', options);
    expect(tree.files).toContain('/foo/user.repository.ts');
    expect(tree.files).toContain('/foo/user.repository.spec.ts');
    expect(tree.readContent('/foo/user.repository.ts')).toContain(
      'export class UserRepository {'
    );
    expect(tree.readContent('/foo/user.repository.spec.ts')).toContain(
      "import { UserRepository } from './user.repository'"
    );
  });
});
