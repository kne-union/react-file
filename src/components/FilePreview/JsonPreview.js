import React, { useState, useEffect } from 'react';
import { getAjax } from '@kne/react-fetch';
import JsonView from '@kne/json-view';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';
import '@kne/json-view/dist/index.css';

const JsonPreview = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(({ url, className, maxWidth, theme = 'dark', collapsedFrom, searchable = true, collapsable = true, indentWidth = 20, showLineNumbers = true }) => {
  const { formatMessage } = useIntl();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ajax = getAjax();
    ajax({ url, method: 'GET' }).then(
      ({ data: responseData }) => {
        try {
          // 如果返回的是字符串，尝试解析为 JSON
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
      <div className={style['text-outer']}>
        {error ? (
          <div className={style['error']}>{formatMessage({ id: 'fileLoadedError' })}</div>
        ) : (
          <JsonView data={data} theme={theme} collapsedFrom={collapsedFrom} searchable={searchable} collapsable={collapsable} indentWidth={indentWidth} showLineNumbers={showLineNumbers} />
        )}
      </div>
    </div>
  );
});

export default JsonPreview;
