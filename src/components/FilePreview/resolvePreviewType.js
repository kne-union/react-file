import typeFormat from './fileExtensions';

export const resolvePreviewType = (url, filename, previewExtensions) => {
  const urlType = url ? typeFormat(url, previewExtensions) : 'unknown';
  if (urlType !== 'unknown') {
    return urlType;
  }
  return filename ? typeFormat(filename, previewExtensions) : 'unknown';
};

export default resolvePreviewType;
