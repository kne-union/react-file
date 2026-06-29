import withOSSFile from '../../hocs/withOSSFile';
import { typeComponentMapping } from './typeFormat';
import resolvePreviewType from './resolvePreviewType';
import useStaticUrl from '../../common/useStaticUrl';
import PreviewSuspense from './PreviewSuspense';

const OSSFilePreviewInner = withOSSFile(({ data, id, staticUrl: staticUrlProps, className, fetchApi, filename, render, ...props }) => {
  const fileUrl = useStaticUrl({ staticUrl: staticUrlProps, url: data });
  const previewType = resolvePreviewType(data, filename);
  const PreviewComponent = typeComponentMapping[previewType] || typeComponentMapping.unknown;

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
      <PreviewComponent {...props} id={id} className={className} url={fileUrl} filename={filename} />
    </PreviewSuspense>
  );
});

export default OSSFilePreviewInner;
