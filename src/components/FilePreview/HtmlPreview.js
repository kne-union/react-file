import iFrameResize from 'iframe-resizer';
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import Fetch from '@kne/react-fetch';
import { useContext, usePreset } from '@kne/global-context';

const HtmlInnerPreview = ({ data, apis: propsApis, contentWindowUrl: contentWindowUrlProps, locale }) => {
  const ref = useRef(null);
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  const contentWindowUrl = contentWindowUrlProps || apis.file?.contentWindowUrl || 'https://cdn.jsdelivr.net/npm/iframe-resizer@4.4.5/js/iframeResizer.contentWindow.min.js';
  useEffect(() => {
    const parser = new DOMParser();
    const domDocument = parser.parseFromString(data, 'text/html');
    domDocument.querySelectorAll('script').forEach(el => {
      el.parentElement.removeChild(el);
    });
    const script = document.createElement('script');
    script.src = contentWindowUrl;
    domDocument.head.appendChild(script);
    const style = document.createElement('style');
    style.innerText = 'html,body{height:auto!important;}body{pointer-events: none;background: #FFFFFF;}';
    domDocument.head.appendChild(style);
    ref.current.srcdoc = domDocument.documentElement.outerHTML;
  }, [data]);
  useEffect(() => {
    iFrameResize.iframeResize({ checkOrigin: false }, ref.current);
  }, []);
  return <iframe title={locale['文件预览']} frameBorder="0" width="100%" ref={ref} />;
};

const HtmlPreview = p => {
  const { locale: contextLocale } = useContext();
  const locale = Object.assign(
    {},
    {
      文件预览: '文件预览'
    },
    contextLocale,
    p.locale
  );

  const { className, url, maxWidth, ...props } = Object.assign({}, p, { locale });

  return (
    <div
      className={classnames(className, style['container'])}
      style={{
        maxWidth
      }}
    >
      <Fetch
        url={url}
        transformResponse={({ data }) => {
          return {
            data: {
              code: 200,
              results: data
            }
          };
        }}
        error={<iframe title={locale['文件预览']} src={url} width="100%" className={style['html-preview-iframe']} />}
        render={({ data }) => {
          return <HtmlInnerPreview {...props} url={url} data={data} />;
        }}
      />
    </div>
  );
};

export default HtmlPreview;
