import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const ImagePreviewInner = ({ url, scale, rotate, className, maxWidth, origin, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { formatMessage } = useIntl();
  useEffect(() => {
    const image = new Image();
    image.src = url;
    const handlerLoad = () => {
      setLoading(false);
    };

    const handlerError = () => {
      setLoading(false);
      setError(true);
    };

    image.addEventListener('load', handlerLoad);
    image.addEventListener('error', handlerError);
    return () => {
      image.removeEventListener('load', handlerLoad);
      image.removeEventListener('error', handlerError);
    };
  }, [url, scale, rotate]);
  if (origin) {
    return <img alt={formatMessage({ id: 'FilePreview.filePreview' })} {...props} className={className} src={url} />;
  }
  return (
    <div
      className={classnames(className, style['container'])}
      style={{
        maxWidth
      }}
    >
      {loading ? (
        <div className={style['loading']}>
          <Spin />
        </div>
      ) : null}
      {error ? <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div> : <img alt={formatMessage({ id: 'FilePreview.filePreview' })} {...props} src={url} />}
    </div>
  );
};

const ImagePreview = withLocale(ImagePreviewInner);

export { ImagePreviewInner };
export default ImagePreview;
