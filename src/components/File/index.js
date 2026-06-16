import withOSSFile from '../../hocs/withOSSFile';
import withLocale from '../../withLocale';

const FileInner = withOSSFile(({ data, children, ...props }) => {
  return children({ url: data, ...props });
});

const File = withLocale(FileInner);

export default File;
