import React from 'react';
import { typeFormatComponent, typeComponentMapping } from './typeFormat';

const TypePreview = ({ url, filename, type, ...props }) => {
  const PreviewComponent = (type && typeComponentMapping[type]) || typeFormatComponent(filename || url);
  return <PreviewComponent {...props} url={url} />;
};

export default TypePreview;
