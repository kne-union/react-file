import React from 'react';
import withOSSFile from '../../hocs/withOSSFile';
import { typeFormatComponent } from './typeFormat';
import useStaticUrl from '../../common/useStaticUrl';

const OSSFilePreview = withOSSFile(({ data, id, staticUrl: staticUrlProps, className, fetchApi, filename, render, ...props }) => {
  const fileUrl = useStaticUrl({ staticUrl: staticUrlProps, url: data });
  const PreviewComponent = (data && typeFormatComponent(data)) || (filename && typeFormatComponent(filename));
  if (typeof render === 'function') {
    return render({
      data,
      id,
      staticUrl: staticUrlProps,
      className,
      fetchApi,
      filename,
      url: fileUrl,
      component: PreviewComponent
    });
  }
  return <PreviewComponent {...props} className={className} url={fileUrl} />;
});

export default OSSFilePreview;
