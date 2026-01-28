import React, { useState, useEffect } from 'react';
import { getAjax } from '@kne/react-fetch';
import style from './style.module.scss';
import { Spin } from 'antd';
import classnames from 'classnames';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import MarkdownRender from '@kne/markdown-components-render';
import zhCn from '../../locale/zh-CN';
import '@kne/markdown-components-render/dist/index.css';

const MarkdownPreview = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(({ url, className, maxWidth, ...props }) => {
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
      <div className={style['text-outer']}>{error ? <div className={style['error']}>{formatMessage({ id: 'fileLoadedError' })}</div> : <MarkdownRender {...props}>{text}</MarkdownRender>}</div>
    </div>
  );
});

export default MarkdownPreview;
