import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';

// eslint-disable-next-line import/prefer-default-export
export async function createAngularApp(
  runner: SchematicTestRunner,
  workspaceOptions: WorkspaceOptions,
  appOptions: ApplicationOptions
): Promise<UnitTestTree> {
  let appTree = await runner
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
  return appTree;
}
