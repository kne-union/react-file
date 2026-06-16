import { createPreviewMapping } from './createPreviewMapping';
import useStaticUrl from '../../common/useStaticUrl';
import { usePreset } from '@kne/global-context';
import PreviewSuspense from './PreviewSuspense';

const { typeComponentMapping, typeFormatComponent } = createPreviewMapping({ includeZipPreview: false });

const InnerTypePreview = ({ url, filename, type, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, props.apis);
  const fileUrl = useStaticUrl({ staticUrl: props.staticUrl || apis.file?.staticUrl, url });
  const PreviewComponent = (type && typeComponentMapping[type]) || typeFormatComponent(filename || fileUrl);

  return (
    <PreviewSuspense>
      <PreviewComponent {...props} url={fileUrl} />
    </PreviewSuspense>
  );
};

export default InnerTypePreview;
