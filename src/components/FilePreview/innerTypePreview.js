import { createPreviewMapping } from './createPreviewMapping';
import useStaticUrl from '../../common/useStaticUrl';
import { usePreset } from '@kne/global-context';
import PreviewSuspense from './PreviewSuspense';
import typeFormat from './fileExtensions';
import { getPreviewMapping } from './previewMapping';

const { typeComponentMapping: innerDefaultMapping } = createPreviewMapping({ includeZipPreview: false });

const InnerTypePreview = ({ url, filename, type, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, props.apis);
  const fileUrl = useStaticUrl({ staticUrl: props.staticUrl || apis.file?.staticUrl, url });
  const mapping = Object.assign({}, innerDefaultMapping, getPreviewMapping(), { zip: innerDefaultMapping.unknown });
  const PreviewComponent = (type && mapping[type]) || mapping[typeFormat(filename || fileUrl)] || mapping.unknown;

  return (
    <PreviewSuspense>
      <PreviewComponent {...props} url={fileUrl} />
    </PreviewSuspense>
  );
};

export default InnerTypePreview;
