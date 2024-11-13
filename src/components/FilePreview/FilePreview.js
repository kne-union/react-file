import React from 'react';
import OSSFilePreview from './OSSFilePreview';
import TypePreview from './TypePreview';

const FilePreview = ({ id, src, originName, filename, ...props }) => {
  if (src) {
    return <TypePreview {...props} url={src} filename={filename || originName} />;
  }
  return <OSSFilePreview {...props} id={id} filename={filename || originName} />;
};

export default FilePreview;
