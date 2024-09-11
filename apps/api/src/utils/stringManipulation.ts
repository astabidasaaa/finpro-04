export function capitalizeString(string: string): string {
  const splitWords = string.trim().split(/\s+/);
  const capitalizeWords = splitWords.map((word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizeWords.join(' ');
}
