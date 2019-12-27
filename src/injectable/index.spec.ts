import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { InjectableOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('Injectable Schematic', () => {
  it('should create injectable class files', () => {
    const options: InjectableOptions = { name: 'user', type: 'repository' };
    const tree = runner.runSchematic('injectable', options);
    const files: string[] = [...tree.files];
    expect(files.includes('/user.repository.ts')).toBe(true);
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
    expect(files.includes('/user.repository.spec.ts')).toBe(true);
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
});
