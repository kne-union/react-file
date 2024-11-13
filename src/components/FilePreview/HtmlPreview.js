import iFrameResize from 'iframe-resizer';
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import { createWithFetch } from '@kne/react-fetch';
import { usePreset } from '@kne/global-context';

const isCrossDomain = url => {
  if (!/^http?s:\/\//.test(url)) {
    return false;
  }
  const currentURL = new URL(window.location.href);
  const targetURL = new URL(url);
  return ['protocol', 'hostname', 'port'].some(name => currentURL[name] !== targetURL[name]);
};

const HtmlInnerPreview = createWithFetch({
  transformResponse: ({ data }) => {
    return {
      data: {
        code: 200,
        results: data
      }
    };
  }
})(({ data, apis: propsApis }) => {
  const ref = useRef(null);
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  useEffect(() => {
    const parser = new DOMParser();
    const domDocument = parser.parseFromString(data, 'text/html');
    domDocument.querySelectorAll('script').forEach(el => {
      el.parentElement.removeChild(el);
    });
    const scriptPath = apis.file?.contentWindowUrl || 'https://cdn.jsdelivr.net/npm/iframe-resizer@4.4.5/js/iframeResizer.contentWindow.min.js';
    const script = document.createElement('script');
    script.src = scriptPath;
    domDocument.head.appendChild(script);
    const style = document.createElement('style');
    style.innerText = 'html,body{height:auto!important;}body{pointer-events: none;background: #FFFFFF;}';
    domDocument.head.appendChild(style);
    ref.current.srcdoc = domDocument.documentElement.outerHTML;
  }, [data]);
  useEffect(() => {
    iFrameResize.iframeResize({ checkOrigin: false }, ref.current);
  }, []);
  return <iframe title="文件预览" frameBorder="0" width="100%" ref={ref} />;
});

const HtmlPreview = ({ className, url, maxWidth }) => {
  return (
    <div
      className={classnames(className, style['container'])}
      style={{
        maxWidth
      }}
    >
      {isCrossDomain(url) ? <iframe title="文件预览" src={url} width="100%" className={style['html-preview-iframe']} /> : <HtmlInnerPreview url={url} />}
    </div>
  );
};

export default HtmlPreview;
