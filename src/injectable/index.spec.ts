import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { InjectableOptions } from './schema';

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0'
};

const appOptions: ApplicationOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipPackageJson: false
};

const defaultOptions: InjectableOptions = {
  name: 'user',
  type: 'repository',
  project: 'bar'
};

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('Injectable Schematic', () => {
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();
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
      project: defaultOptions.project
    };
    const tree = await runner
      .runSchematicAsync('injectable', options, appTree)
      .toPromise();
    expect(tree.files).toContain('/projects/bar/src/app/user.service.ts');
    expect(tree.files).toContain('/projects/bar/src/app/user.service.spec.ts');

    expect(tree.readContent('/projects/bar/src/app/user.service.ts')).toContain(
      'UserService'
    );

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

  it('should create files in the path if name is provided with path', async () => {
    const options: InjectableOptions = {
      ...defaultOptions,
      name: 'foo/user'
    };
    const tree = await runner
      .runSchematicAsync('injectable', options, appTree)
      .toPromise();
    expect(tree.files).toContain(
      '/projects/bar/src/app/foo/user.repository.ts'
    );
    expect(tree.files).toContain(
      '/projects/bar/src/app/foo/user.repository.spec.ts'
    );
    expect(
      tree.readContent('/projects/bar/src/app/foo/user.repository.ts')
    ).toContain('export class UserRepository {');
    expect(
      tree.readContent('/projects/bar/src/app/foo/user.repository.spec.ts')
    ).toContain("import { UserRepository } from './user.repository'");
  });

  it('should create files in the named directory if --flat optin is false', async () => {
    const options: InjectableOptions = {
      ...defaultOptions,
      flat: false
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
      flat: false
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

  it('should create files in the custom project root', async () => {
    const config = JSON.parse(appTree.readContent('/angular.json'));
    expect(config?.projects?.bar).toBeDefined();
    config.projects.bar.sourceRoot = 'projects/bar/custom';
    appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
    appTree = await runner
      .runSchematicAsync('injectable', defaultOptions, appTree)
      .toPromise();
    expect(appTree.files).toContain(
      '/projects/bar/custom/app/user.repository.ts'
    );
  });

  it('should not create a test file if --skipTests is true', async () => {
    const options: InjectableOptions = {
      ...defaultOptions,
      skipTests: true
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
