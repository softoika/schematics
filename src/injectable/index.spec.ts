import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { InjectableOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('Injectable Schematic', () => {
  it('works', () => {
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
  });
});
