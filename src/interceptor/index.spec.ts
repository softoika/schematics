import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { createAngularApp } from '../utils/test/create-angular-app';

const appOptions: ApplicationOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  skipPackageJson: false
};

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  version: '6.0.0'
};

const collectionPath = path.join(__dirname, '../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
describe('Interceptor Schematic', () => {
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createAngularApp(runner, workspaceOptions, appOptions);
  });

  it('should create files', async () => {
    const tree = await runner
      .runSchematicAsync(
        'interceptor',
        { name: 'foo', project: 'bar' },
        appTree
      )
      .toPromise();
    expect(tree.files).toContain('/bar/src/app/foo.interceptor.ts');
    expect(tree.readContent('/bar/src/app/foo.interceptor.ts')).toContain(
      'export class FooInterceptor implements HttpInterceptor {'
    );
  });

  it('should be considered --flat option', async () => {
    const tree = await runner
      .runSchematicAsync(
        'interceptor',
        {
          name: 'foo',
          project: 'bar',
          flat: false
        },
        appTree
      )
      .toPromise();
    expect(tree.files).toContain('/bar/src/app/foo/foo.interceptor.ts');
  });
});
