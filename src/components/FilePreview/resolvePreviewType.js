import typeFormat from './fileExtensions';

export const resolvePreviewType = (url, filename) => {
  const urlType = url ? typeFormat(url) : 'unknown';
  if (urlType !== 'unknown') {
    return urlType;
  }
  return filename ? typeFormat(filename) : 'unknown';
};

export default resolvePreviewType;
