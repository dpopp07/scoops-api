import type { DefinedError } from 'ajv';

export function parseAjvErrors(errors: DefinedError[]): string {
  if (!errors.length) {
    return '';
  }

  // For now, only look at the first error.
  const primary = errors[0];

  let { instancePath, message } = primary;

  if (instancePath) {
    // Remove the leading slash from the instance path.
    instancePath = instancePath.replace(/^\//, '');

    // Surround the instance path with quotes.
    instancePath = enquote(instancePath);
  }

  // Create a new prefix for the string.
  let prefix = instancePath ? 'Property' : 'Resource';
  prefix = `${prefix} ${instancePath}`.trim();

  // The quotes around the pattern are ugly, remove them.
  if (primary.keyword === 'pattern') {
    const { pattern } = primary.params;
    message = message?.replace(`"${pattern}"`, pattern);
  }

  return `${prefix} ${message}`;
}

function enquote(s: string) {
  return `'${s}'`;
}
