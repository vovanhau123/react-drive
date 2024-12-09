export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getFileTypeIcon = (type) => {
  switch (type) {
    case 'folder':
      return 'folder';
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return 'file image';
    case 'application/pdf':
      return 'file pdf';
    default:
      return 'file';
  }
}; 