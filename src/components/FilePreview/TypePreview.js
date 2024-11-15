import React from 'react';
import { typeFormatComponent, typeComponentMapping } from './typeFormat';
import { usePreset } from '@kne/global-context';
import useStaticUrl from '../../common/useStaticUrl';

const TypePreview = ({ url, filename, type, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, props.apis);
  const fileUrl = useStaticUrl({ staticUrl: props.staticUrl || apis.file?.staticUrl, url });
  const PreviewComponent = (type && typeComponentMapping[type]) || typeFormatComponent(filename || fileUrl);
  return <PreviewComponent {...props} url={fileUrl} />;
};

export default TypePreview;
