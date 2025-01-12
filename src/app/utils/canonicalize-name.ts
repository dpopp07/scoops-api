export function canonicalizeName(name: string) {
  return name.toLowerCase().replace(/ /g, '-');
}
