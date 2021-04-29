import { Tree } from '@angular-devkit/schematics';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace/definitions';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  getWorkspace,
  buildDefaultPath,
} from '@schematics/angular/utility/workspace';

export interface AngularProjectOptions {
  name: string;
  path?: string;
  project?: string;
}

export async function applyDefaultPath<T extends AngularProjectOptions>(
  options: T,
  tree: Tree
): Promise<T> {
  let workspace: WorkspaceDefinition | undefined;
  try {
    workspace = await getWorkspace(tree);
  } catch (error) {
    // Make it work even if not in angular workspace
    workspace = undefined;
  }

  let defaultPath: string | undefined;
  if (workspace) {
    const projectDefinition = workspace.projects.get(options.project as string);
    if (projectDefinition) {
      defaultPath = buildDefaultPath(projectDefinition);
    } else {
      throw new Error('Specified project does not exist.');
    }
  }

  const newOptions = { ...options };
  newOptions.path = defaultPath ?? options.path;
  return newOptions;
}

export function applyNameParsing<T extends AngularProjectOptions>(
  options: T
): T {
  const location = parseName(options.path ?? '', options.name);
  const newOptions = { ...options };
  newOptions.name = location.name;
  newOptions.path = location.path;
  return newOptions;
}
