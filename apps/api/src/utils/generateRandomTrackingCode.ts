export function generateRandomTrackingCode(): string {
    return 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  