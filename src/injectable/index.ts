import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  template,
  url,
  mergeWith,
  move
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { InjectableOptions } from './schema';

export default function(options: InjectableOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    let appliedOptions = options;
    if (options.project) {
      appliedOptions = await applyDefaultPath(options, tree);
    }
    appliedOptions = applyNameParsing(appliedOptions);

    const templates = apply(url('./files'), [
      template({
        ...appliedOptions,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...strings
      }),
      move(appliedOptions.path || '')
    ]);
    return mergeWith(templates);
  };
}

async function applyDefaultPath(
  options: InjectableOptions,
  tree: Tree
): Promise<InjectableOptions> {
  const { path, project, ...remainingOptions } = options;

  let defaultPath: string | undefined;
  if (path === undefined && typeof project === 'string') {
    defaultPath = await createDefaultPath(tree, project);
  }

  const newOptions = {
    path: defaultPath ?? path,
    project,
    ...remainingOptions
  };
  return new Promise<InjectableOptions>(resolve => resolve(newOptions));
}

function applyNameParsing(options: InjectableOptions): InjectableOptions {
  const { name, path, ...remainingOptions } = options;
  const location = parseName(path || '', name);
  return { name: location.name, path: location.path, ...remainingOptions };
}
