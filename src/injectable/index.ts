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
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { InjectableOptions } from './schema';
import {
  applyDefaultPath,
  applyNameParsing
} from '../utils/options-transformer';

export default function(options: InjectableOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    let appliedOptions = await applyDefaultPath<InjectableOptions>(
      options,
      tree
    );
    appliedOptions = applyNameParsing<InjectableOptions>(appliedOptions);

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
