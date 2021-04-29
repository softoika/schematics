import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { InjectableOptions } from './schema';
import { createAngularApp } from '../utils/test/create-angular-app';

const appOptions: ApplicationOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipPackageJson: false,
};

const defaultOptions: InjectableOptions = {
  name: 'user',
  type: 'repository',
  project: 'bar',
};

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('Injectable Schematic', () => {
  describe('not in angular workspace', () => {
    it('should create files in root', async () => {
      const options = { name: defaultOptions.name, type: defaultOptions.type };
      const tree = await runner
        .runSchematicAsync('injectable', options)
        .toPromise();
      expect(tree.files).toContain('/user.repository.ts');
    });
  });

  describe('multiple projects workspace', () => {
    const workspaceOptions: WorkspaceOptions = {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0',
    };

    let appTree: UnitTestTree;

    beforeEach(async () => {
      appTree = await createAngularApp(runner, workspaceOptions, appOptions);
    });

    it('should create injectable class files', async () => {
      const tree = await runner
        .runSchematicAsync('injectable', defaultOptions, appTree)
        .toPromise();
      expect(tree.files).toContain('/projects/bar/src/app/user.repository.ts');
      expect(
        tree.readContent('/projects/bar/src/app/user.repository.ts')
      ).toEqual(
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
      expect(tree.files).toContain(
        '/projects/bar/src/app/user.repository.spec.ts'
      );
      expect(
        tree.readContent('/projects/bar/src/app/user.repository.spec.ts')
      ).toEqual(
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

    it('should create files as service class without --type option', async () => {
      const options: InjectableOptions = {
        name: 'user',
        project: defaultOptions.project,
      };
      const tree = await runner
        .runSchematicAsync('injectable', options, appTree)
        .toPromise();
      expect(tree.files).toContain('/projects/bar/src/app/user.service.ts');
      expect(tree.files).toContain(
        '/projects/bar/src/app/user.service.spec.ts'
      );

      expect(
        tree.readContent('/projects/bar/src/app/user.service.ts')
      ).toContain('UserService');

      const specContent = tree.readContent(
        '/projects/bar/src/app/user.service.spec.ts'
      );
      expect(specContent).toContain(
        "import { UserService } from './user.service'"
      );
      expect(specContent).toContain(
        'const service: UserService = TestBed.get(UserService);'
      );
    });

    it('should create files in the named directory if --flat option is false', async () => {
      const options: InjectableOptions = {
        ...defaultOptions,
        flat: false,
      };
      const tree = await runner
        .runSchematicAsync('injectable', options, appTree)
        .toPromise();
      expect(tree.files).toContain(
        '/projects/bar/src/app/user/user.repository.ts'
      );
      expect(tree.files).toContain(
        '/projects/bar/src/app/user/user.repository.spec.ts'
      );
    });

    it(`should create files in '/path/the-named-directory' if path and --flat false are provided`, async () => {
      const options: InjectableOptions = {
        ...defaultOptions,
        name: 'path/user',
        flat: false,
      };
      const tree = await runner
        .runSchematicAsync('injectable', options, appTree)
        .toPromise();
      expect(tree.files).toContain(
        '/projects/bar/src/app/path/user/user.repository.ts'
      );
      expect(tree.files).toContain(
        '/projects/bar/src/app/path/user/user.repository.spec.ts'
      );
    });

    it('should not create a test file if --skipTests is true', async () => {
      const options: InjectableOptions = {
        ...defaultOptions,
        skipTests: true,
      };
      const tree = await runner
        .runSchematicAsync('injectable', options, appTree)
        .toPromise();
      expect(tree.files).toContain('/projects/bar/src/app/user.repository.ts');
      expect(tree.files).not.toContain(
        '/projects/bar/src/app/user.repository.spec.ts'
      );
    });
  });
});
