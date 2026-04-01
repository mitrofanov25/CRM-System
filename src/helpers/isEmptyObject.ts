export default function isEmptyObject<T extends Record<string, unknown>>(
  obj: T,
): boolean {
  return obj != null && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj).length === 0
    : false;
}
