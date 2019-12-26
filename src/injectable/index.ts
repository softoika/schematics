import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  template,
  url,
  mergeWith
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { InjectableOptions } from './schema';

export default function(options: InjectableOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templates = apply(url('./files'), [
      template({ ...options, ...strings })
    ]);
    return mergeWith(templates);
  };
}
