import React from 'react';
import withOSSFile from '../../hocs/withOSSFile';
import { typeFormatComponent } from './typeFormat';
import useStaticUrl from '../../common/useStaticUrl';

const OSSFilePreview = withOSSFile(({ data, id, staticUrl: staticUrlProps, className, fetchApi, filename, ...props }) => {
  const fileUrl = useStaticUrl({ staticUrl: staticUrlProps, url: data });
  const PreviewComponent = (data && typeFormatComponent(data)) || (filename && typeFormatComponent(filename));
  return <PreviewComponent {...props} className={className} url={fileUrl} />;
});

export default OSSFilePreview;
