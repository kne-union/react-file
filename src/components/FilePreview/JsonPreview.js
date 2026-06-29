import { useState, useEffect } from 'react';
import { getAjax } from '@kne/react-fetch';
import JsonView from '@kne/json-view';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import '@kne/json-view/dist/index.css';

const JsonPreviewInner = ({ url, className, maxWidth, theme = 'dark', collapsedFrom, searchable = true, collapsable = true, indentWidth = 20, showLineNumbers = true }) => {
  const { formatMessage } = useIntl();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ajax = getAjax();
    ajax({ url, method: 'GET' }).then(
      ({ data: responseData }) => {
        if (cancelled) {
          return;
        }
        try {
          const jsonData = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
          setData(jsonData);
          setLoading(false);
        } catch (e) {
          console.error('JSON parse error:', e);
          setError(true);
          setLoading(false);
        }
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
      <div className={style['text-outer']}>
        {error ? (
          <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div>
        ) : (
          <JsonView data={data} theme={theme} collapsedFrom={collapsedFrom} searchable={searchable} collapsable={collapsable} indentWidth={indentWidth} showLineNumbers={showLineNumbers} />
        )}
      </div>
    </div>
  );
};

const JsonPreview = withLocale(JsonPreviewInner);

export { JsonPreviewInner };
export default JsonPreview;
