import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';

const ImagePreview = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(({ url, scale, rotate, className, maxWidth }) => {
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
      {error ? <div className={style['error']}>{formatMessage({ id: 'fileLoadedError' })}</div> : <img src={url} alt={formatMessage({ id: 'filePreview' })} />}
    </div>
  );
});

export default ImagePreview;
