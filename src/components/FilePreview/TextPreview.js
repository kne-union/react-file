import { useState, useEffect } from 'react';
import { getAjax } from '@kne/react-fetch';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const TextPreviewInner = ({ url, className, maxWidth }) => {
  const { formatMessage } = useIntl();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const ajax = getAjax();
    ajax({ url, method: 'GET' }).then(
      ({ data }) => {
        setText(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError(true);
      }
    );
  }, [url]);

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
      <div className={style['text-outer']}>{error ? <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div> : <div className={style['text-inner']}>{text}</div>}</div>
    </div>
  );
};

const TextPreview = withLocale(TextPreviewInner);

export { TextPreviewInner };
export default TextPreview;
