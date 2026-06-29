import { useState, useEffect } from 'react';
import { getAjax } from '@kne/react-fetch';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import MarkdownRender from '@kne/markdown-components-render';
import '@kne/markdown-components-render/dist/index.css';

const MarkdownPreviewInner = ({ url, className, maxWidth, ...props }) => {
  const { formatMessage } = useIntl();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const ajax = getAjax();
    ajax({ url, method: 'GET' }).then(
      ({ data }) => {
        if (cancelled) {
          return;
        }
        setText(data);
        setLoading(false);
      },
      () => {
        if (cancelled) {
          return;
        }
        setLoading(false);
        setError(true);
      }
    );
    return () => {
      cancelled = true;
    };
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
      <div className={style['text-outer']}>{error ? <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div> : <MarkdownRender {...props}>{text}</MarkdownRender>}</div>
    </div>
  );
};

const MarkdownPreview = withLocale(MarkdownPreviewInner);

export { MarkdownPreviewInner };
export default MarkdownPreview;
