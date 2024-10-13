export const truncateUrl = (url: string, maxLength: number = 30): string => {
  if (url && url.length <= maxLength) return url;
  if (url) {
    const start = url.slice(0, 15); // Keep first 15 characters
    const end = url.slice(-10); // Keep last 10 characters
    return `${start}...${end}`; // Concatenate with ellipsis
  }
};
