import iFrameResize from '@kne/iframe-resizer';
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import Fetch from '@kne/react-fetch';
import { useContext, usePreset } from '@kne/global-context';

const HtmlInnerPreview = ({ data, apis: propsApis, contentWindowUrl: contentWindowUrlProps, locale }) => {
  const ref = useRef(null);
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  //  https://uc.fatalent.cn/packages/@kne/iframe-resizer/0.1.2/dist/contentWindow.js https://cdn.jsdelivr.net/npm/@kne/iframe-resizer@0.1.3/dist/contentWindow.js
  const contentWindowUrl = contentWindowUrlProps || apis.file?.contentWindowUrl || 'https://cdn.jsdelivr.net/npm/@kne/iframe-resizer@0.1.3/dist/contentWindow.js';
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
    iFrameResize({ checkOrigin: false }, ref.current);
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

  const { className, url, maxWidth, ignoreContent, ...props } = Object.assign({}, p, { locale });

  const defaultIframe = <iframe title={locale['文件预览']} src={url} width="100%" className={style['html-preview-iframe']} />;

  return (
    <div
      className={classnames(className, style['container'])}
      style={{
        maxWidth
      }}
    >
      {ignoreContent ? (
        defaultIframe
      ) : (
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
          showError={false}
          error={defaultIframe}
          render={({ data }) => {
            return <HtmlInnerPreview {...props} url={url} data={data} />;
          }}
        />
      )}
    </div>
  );
};

export default HtmlPreview;
