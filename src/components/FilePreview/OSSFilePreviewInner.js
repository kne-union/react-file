import withOSSFile from '../../hocs/withOSSFile';
import { typeFormatComponent } from './typeFormat';
import useStaticUrl from '../../common/useStaticUrl';
import PreviewSuspense from './PreviewSuspense';

const OSSFilePreviewInner = withOSSFile(({ data, id, staticUrl: staticUrlProps, className, fetchApi, filename, render, ...props }) => {
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

  return (
    <PreviewSuspense>
      <PreviewComponent {...props} className={className} url={fileUrl} filename={filename} />
    </PreviewSuspense>
  );
});

export default OSSFilePreviewInner;
