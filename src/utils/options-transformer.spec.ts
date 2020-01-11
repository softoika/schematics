import { Tree } from '@angular-devkit/schematics';
import {
  UnitTestTree,
  SchematicTestRunner
} from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import * as path from 'path';
import {
  AngularProjectOptions,
  applyDefaultPath,
  applyNameParsing
} from './options-transformer';
import { createAngularApp } from './test/create-angular-app';

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);

describe('applyDefaultPath', () => {
  describe('in not angular workspace', () => {
    it('should not change path', async () => {
      const tree = Tree.empty();
      try {
        const options = await applyDefaultPath<AngularProjectOptions>(
          { name: 'foo' },
          tree
        );
        expect(options).toEqual(options);
      } catch (error) {
        throw new Error(`The error should not be thrown: '${error}'`);
      }
    });
  });

  describe('in angular workspace', () => {
    const workspaceOptions: WorkspaceOptions = {
      name: 'workspace',
      version: '6.0.0'
    };
    const appOptions: ApplicationOptions = {
      name: 'bar',
      inlineStyle: false,
      inlineTemplate: false,
      routing: false,
      skipPackageJson: false
    };
    let appTree: UnitTestTree;

    beforeEach(async () => {
      appTree = await createAngularApp(runner, workspaceOptions, appOptions);
    });

    it('should throw an error if --project is not passed', () => {
      const options = { name: 'foo' };
      expect(
        applyDefaultPath<AngularProjectOptions>(options, appTree)
      ).rejects.toThrowError('Specified project does not exist.');
    });

    it('should return options that the path is the angular default path', async () => {
      const options = await applyDefaultPath<AngularProjectOptions>(
        { name: 'foo', project: 'bar' },
        appTree
      );
      expect(options.path).toBe('/bar/src/app');
    });

    it('should be considered the custom project root', async () => {
      const config = JSON.parse(appTree.readContent('/angular.json'));
      expect(config?.projects?.bar).toBeDefined();
      config.projects.bar.sourceRoot = 'bar/custom';
      appTree.overwrite('/angular.json', JSON.stringify(config, null, 2));
      const options = await applyDefaultPath<AngularProjectOptions>(
        { name: 'foo', project: 'bar' },
        appTree
      );
      expect(options.path).toBe('/bar/custom/app');
    });
  });
});

describe('applyNameParsing', () => {
  it('should not change input options', () => {
    const options: AngularProjectOptions = { name: 'foo/bar' };
    const before = { ...options };
    applyNameParsing<AngularProjectOptions>(options);
    expect(options).toEqual(before);
  });
});
