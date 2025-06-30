import { formatDistanceToNow } from 'date-fns';

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '-';

  try {
    // Handle ISO string format
    if (typeof timestamp === 'string') {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }

    // Handle Firebase timestamp format
    if (timestamp._seconds) {
      return formatDistanceToNow(new Date(timestamp._seconds * 1000), {
        addSuffix: true,
      });
    }

    // Handle regular date object
    if (timestamp instanceof Date) {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    }

    // Handle timestamp number
    if (typeof timestamp === 'number') {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }

    // Fallback for other formats
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error, timestamp);
    return '-';
  }
};
