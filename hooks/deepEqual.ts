export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (
    obj1 == null || typeof obj1 !== "object" ||
    obj2 == null || typeof obj2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = (obj1 as Record<string, unknown>)[key];
    const val2 = (obj2 as Record<string, unknown>)[key];

    if (!keys2.includes(key) || !deepEqual(val1, val2)) return false;
  }

  return true;
}
