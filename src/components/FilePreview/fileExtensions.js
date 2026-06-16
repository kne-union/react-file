export const PREVIEWABLE_FILE_PATTERN = /\.(txt|md|pdf|png|jpg|jpeg|gif|bmp|webp|svg|html|htm|doc|docx|xls|xlsx|ppt|pptx|csv|mp3|wav|ogg|aac|mp4|avi|mov|mkv|flv|zip|rar|7z|tar|gz|json)$/i;

export const EXTENSION_MIME = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  html: 'text/html',
  htm: 'text/html',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg'
};

export const guessContentType = path => {
  const ext = path.split('.').pop()?.toLowerCase();
  return (ext && EXTENSION_MIME[ext]) || 'application/octet-stream';
};

export const getOfficePreviewType = (url, filename) => {
  const source = (filename || url || '').split('?')[0].toLowerCase();
  if (/\.docx$/.test(source)) {
    return 'docx';
  }
  if (/\.xlsx$/.test(source)) {
    return 'xlsx';
  }
  return 'office';
};

export const getZipEntrySize = zipEntry => {
  if (typeof zipEntry.uncompressedSize === 'number') {
    return zipEntry.uncompressedSize;
  }
  return zipEntry._data?.uncompressedSize ?? 0;
};

const typeFormat = url => {
  if (typeof url !== 'string') {
    return 'unknown';
  }
  const path = (url || '').split('?')[0];
  const _path = path.toLowerCase();
  if (/.txt$/.test(_path)) {
    return 'txt';
  }
  if (/.md$/.test(_path)) {
    return 'markdown';
  }
  if (/.pdf$/.test(_path)) {
    return 'pdf';
  }
  if (/.(png|jpg|jpeg|gif|bmp|webp|svg)$/.test(_path)) {
    return 'image';
  }
  if (/.(html|htm)$/.test(_path)) {
    return 'html';
  }
  if (/.(doc|docx|xls|xlsx|ppt|pptx|csv)$/.test(_path)) {
    return 'office';
  }
  if (/.(mp3|wav|ogg|aac)$/.test(_path)) {
    return 'audio';
  }
  if (/.(mp4|avi|mov|mkv|flv)$/.test(_path)) {
    return 'video';
  }
  if (/.(zip|rar|7z|tar|gz)$/.test(_path)) {
    return 'zip';
  }
  if (/.json$/.test(_path)) {
    return 'json';
  }
  return 'unknown';
};

export default typeFormat;
