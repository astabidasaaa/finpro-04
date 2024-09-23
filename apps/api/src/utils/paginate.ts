export function paginate(array: any[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
}
