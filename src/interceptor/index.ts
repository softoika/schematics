import {
  Rule,
  Tree,
  apply,
  url,
  template,
  move,
  chain,
  mergeWith,
  noop,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { InterceptorOptions } from './schema';
import {
  applyDefaultPath,
  applyNameParsing,
} from '../utils/options-transformer';

export default function (options: InterceptorOptions): Rule {
  return async (tree: Tree): Promise<Rule> => {
    let appliedOptions = await applyDefaultPath(options, tree);
    appliedOptions = applyNameParsing(appliedOptions);

    const templates = apply(url('./files'), [
      template({
        ...appliedOptions,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...strings,
      }),
      move(appliedOptions.path ?? ''),
    ]);

    return chain([
      mergeWith(templates),
      options.lintFix ? applyLintFix(appliedOptions.path) : noop(),
    ]);
  };
}
