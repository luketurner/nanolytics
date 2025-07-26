export function createKeysForObject(object: Record<string, any>): string {
  return Object.keys(object).join(", ");
}

export function createValuesForObject(object: Record<string, any>): string {
  return Object.keys(object)
    .map((k) => `:${k}`)
    .join(", ");
}

export function updateForObject(object: Record<string, any>): string {
  return Object.keys(object)
    .map((k) => `${k} = :${k}`)
    .join(", ");
}

export function booleanFromNumber(
  value: boolean | number | null | undefined
): undefined | boolean {
  if (value === 1) return true;
  if (value === 0) return false;
  if (typeof value === "boolean") return value;
  return undefined;
}
