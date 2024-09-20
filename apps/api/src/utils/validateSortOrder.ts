export const validateSortOrder = (
  sortOrder: string | undefined,
): 'asc' | 'desc' => {
  if (sortOrder === 'asc' || sortOrder === 'desc') {
    return sortOrder;
  }
  return 'desc';
};
