import { typeFormatComponent, typeComponentMapping } from './previewMapping';
import { usePreset } from '@kne/global-context';
import useStaticUrl from '../../common/useStaticUrl';
import PreviewSuspense from './PreviewSuspense';

const TypePreview = ({ url, filename, type, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, props.apis);
  const fileUrl = useStaticUrl({ staticUrl: props.staticUrl || apis.file?.staticUrl, url });
  const PreviewComponent = (type && typeComponentMapping[type]) || typeFormatComponent(filename || fileUrl);

  return (
    <PreviewSuspense>
      <PreviewComponent {...props} url={fileUrl} filename={filename} />
    </PreviewSuspense>
  );
};

export default TypePreview;
