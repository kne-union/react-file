import React from 'react';
import { typeFormatComponent, typeComponentMapping } from './typeFormat';
import { usePreset } from '@kne/global-context';

const TypePreview = ({ url, filename, type, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, props.apis);
  const staticUrl = props.staticUrl || apis.file?.staticUrl || '';
  const PreviewComponent = (type && typeComponentMapping[type]) || typeFormatComponent(filename || url);
  return <PreviewComponent {...props} url={/^https?:\/\//.test(url) ? url : staticUrl + url} />;
};

export default TypePreview;
