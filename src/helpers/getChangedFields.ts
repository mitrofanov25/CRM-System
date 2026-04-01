export default function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  values: T,
): Partial<T> {
  const changes: Partial<T> = {};
  for (const key in values) {
    if (key in original && values[key] !== original[key]) {
      changes[key] = values[key];
    }
  }

  return changes;
}
