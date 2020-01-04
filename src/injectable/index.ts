import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  template,
  url,
  mergeWith,
  move,
  filter,
  noop,
  chain
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace/definitions';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  getWorkspace,
  buildDefaultPath
} from '@schematics/angular/utility/workspace';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { InjectableOptions } from './schema';

export default function(options: InjectableOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    let appliedOptions = await applyDefaultPath(options, tree);
    appliedOptions = applyNameParsing(appliedOptions);

    const templates = apply(url('./files'), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts')) : noop(),
      template({
        ...appliedOptions,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...strings
      }),
      move(appliedOptions.path || '')
    ]);

    return chain([
      mergeWith(templates),
      options.lintFix ? applyLintFix(appliedOptions.path) : noop()
    ]);
  };
}

async function applyDefaultPath(
  options: InjectableOptions,
  tree: Tree
): Promise<InjectableOptions> {
  const { path, project, ...remainingOptions } = options;

  let workspace: WorkspaceDefinition | undefined;
  try {
    workspace = await getWorkspace(tree);
  } catch (error) {
    // Make it work even if not in angular workspace
    workspace = undefined;
  }

  let defaultPath: string | undefined;
  if (workspace) {
    const projectDefinition = workspace.projects.get(project as string);
    if (projectDefinition) {
      defaultPath = buildDefaultPath(projectDefinition);
    } else {
      throw new Error('Specified project does not exist.');
    }
  }

  return {
    path: defaultPath ?? path,
    project,
    ...remainingOptions
  };
}

function applyNameParsing(options: InjectableOptions): InjectableOptions {
  const { name, path, ...remainingOptions } = options;
  const location = parseName(path || '', name);
  return { name: location.name, path: location.path, ...remainingOptions };
}
