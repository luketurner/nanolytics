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
