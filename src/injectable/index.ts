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
import { InjectableOptions } from './schema';

export default function(options: InjectableOptions): Rule {
  const transformedOptions = transformToParsedName(options);
  return (_tree: Tree, _context: SchematicContext) => {
    const templates = apply(url('./files'), [
      template({ ...transformedOptions, ...strings }),
      move(transformedOptions.path || '')
    ]);
    return mergeWith(templates);
  };
}

function transformToParsedName(options: InjectableOptions): InjectableOptions {
  const { name, path, ...remainingOptions } = options;
  const location = parseName(path || '', name);
  return { name: location.name, path: location.path, ...remainingOptions };
}
