import iFrameResize from '@kne/iframe-resizer';
import { useEffect, useRef } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import Fetch from '@kne/react-fetch';
import { usePreset } from '@kne/global-context';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const HtmlInnerPreviewInner = ({ data, apis: propsApis, contentWindowUrl: contentWindowUrlProps }) => {
  const ref = useRef(null);
  const { apis: baseApis } = usePreset();
  const { formatMessage } = useIntl();
  const apis = Object.assign({}, baseApis, propsApis);
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
  }, [data, contentWindowUrl]);
  useEffect(() => {
    iFrameResize({ checkOrigin: false }, ref.current);
  }, [contentWindowUrl]);
  return <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} frameBorder="0" width="100%" ref={ref} />;
};

const HtmlPreviewInner = p => {
  const { formatMessage } = useIntl();
  const { className, url, maxWidth, ignoreContent, ...props } = Object.assign({}, p);

  const defaultIframe = <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} src={url} width="100%" className={style['html-preview-iframe']} />;

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
            return <HtmlInnerPreviewInner {...props} url={url} data={data} />;
          }}
        />
      )}
    </div>
  );
};

const HtmlPreview = withLocale(HtmlPreviewInner);

export { HtmlPreviewInner, HtmlInnerPreviewInner };
export default HtmlPreview;
