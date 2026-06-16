import OSSFilePreviewInner from './OSSFilePreviewInner';
import TypePreview from './TypePreview';
import withLocale from '../../withLocale';

const FilePreviewInner = ({ id, src, originName, filename, ...props }) => {
  if (src) {
    return <TypePreview {...props} url={src} filename={filename || originName} />;
  }
  return <OSSFilePreviewInner {...props} id={id} filename={filename || originName} />;
};

const FilePreview = withLocale(FilePreviewInner);

export { FilePreviewInner };
export default FilePreview;
