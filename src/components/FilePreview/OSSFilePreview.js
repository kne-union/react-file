import React from 'react';
import withOSSFile from '../../hocs/withOSSFile';
import { typeFormatComponent } from './typeFormat';
import { usePreset } from '@kne/global-context';

const OSSFilePreview = withOSSFile(({ data, id, staticUrl: staticUrlProps, className, fetchApi, filename, ...props }) => {
  const { apis } = usePreset();
  const staticUrl = staticUrlProps || apis.file?.staticUrl || '';
  const PreviewComponent = (filename && typeFormatComponent(filename)) || typeFormatComponent(data);
  return <PreviewComponent {...props} className={className} url={/^https?:\/\//.test(data) ? data : staticUrl + data} />;
});

export default OSSFilePreview;
