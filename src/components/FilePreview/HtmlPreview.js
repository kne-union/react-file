import iFrameResize from '@kne/iframe-resizer';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import { getAjax } from '@kne/react-fetch';
import { Spin } from 'antd';
import { usePreset } from '@kne/global-context';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import { formatStaticUrl } from '../../common/useStaticUrl';
import { sanitizeHtmlDocument } from '../../common/sanitizeHtml';

const SRCDOC_IFRAME_SANDBOX = 'allow-same-origin';
const REMOTE_IFRAME_SANDBOX = 'allow-same-origin allow-scripts allow-popups';

const isCrossOriginUrl = url => {
  if (!url || typeof window === 'undefined') {
    return false;
  }
  try {
    return new URL(url, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
};

const buildFileContentUrl = ({ id, filename, getFileContentUrl, staticUrl }) => {
  if (!id) {
    return '';
  }
  const template = getFileContentUrl;
  if (typeof template === 'string') {
    return formatStaticUrl({
      staticUrl,
      url: template.replace('{id}', id).replace(':id', id)
    });
  }
  return formatStaticUrl({
    staticUrl,
    url: `/api/v1/static/file-id/${id}${filename ? `?filename=${encodeURIComponent(filename)}` : ''}`
  });
};

const loadHtmlContent = async ({ url, id, filename, getFileContentUrl, staticUrl }) => {
  const ajax = getAjax();
  const candidates = [url, buildFileContentUrl({ id, filename, getFileContentUrl, staticUrl })].filter(Boolean);
  const uniqueCandidates = [...new Set(candidates)];

  let lastError;
  for (const candidate of uniqueCandidates) {
    try {
      const { data } = await ajax({ url: candidate, method: 'GET', responseType: 'text' });
      if (typeof data === 'string' && data.trim()) {
        return data;
      }
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Failed to load HTML');
};

const HtmlInnerPreviewInner = ({ data, apis: propsApis, contentWindowUrl: contentWindowUrlProps }) => {
  const ref = useRef(null);
  const resizeRef = useRef(null);
  const { apis: baseApis } = usePreset();
  const { formatMessage } = useIntl();
  const apis = Object.assign({}, baseApis, propsApis);
  const contentWindowUrl = contentWindowUrlProps || apis.file?.contentWindowUrl || 'https://cdn.jsdelivr.net/npm/@kne/iframe-resizer@0.1.3/dist/contentWindow.js';

  useEffect(() => {
    if (!ref.current || !data) {
      return;
    }
    const parser = new DOMParser();
    const domDocument = parser.parseFromString(data, 'text/html');
    sanitizeHtmlDocument(domDocument);
    const script = document.createElement('script');
    script.src = contentWindowUrl;
    domDocument.head.appendChild(script);
    const styleNode = document.createElement('style');
    styleNode.innerText = 'html,body{height:auto!important;}body{pointer-events: none;background: #FFFFFF;}';
    domDocument.head.appendChild(styleNode);
    ref.current.srcdoc = domDocument.documentElement.outerHTML;
    try {
      resizeRef.current = iFrameResize({ checkOrigin: false }, ref.current);
    } catch (error) {
      resizeRef.current = null;
    }

    return () => {
      try {
        resizeRef.current?.iFrameResizer?.removeListeners?.();
      } catch (error) {
        // ignore cleanup errors
      }
      resizeRef.current = null;
    };
  }, [data, contentWindowUrl]);

  return <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} frameBorder="0" width="100%" ref={ref} sandbox={SRCDOC_IFRAME_SANDBOX} className={style['html-preview-iframe']} />;
};

const HtmlPreviewInner = p => {
  const { formatMessage } = useIntl();
  const { apis: baseApis } = usePreset();
  const { className, url, id, filename, maxWidth, ignoreContent, apis: propsApis, staticUrl: staticUrlProps, ...props } = Object.assign({}, p);
  const apis = Object.assign({}, baseApis, propsApis);
  const staticUrl = staticUrlProps || apis.file?.staticUrl || '';
  const getFileContentUrl = apis.file?.getFileContentUrl?.url || apis.file?.getFileContentUrl;
  const crossOrigin = isCrossOriginUrl(url);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(!ignoreContent && !crossOrigin);
  const [iframeFallback, setIframeFallback] = useState(false);
  const useDirectIframe = ignoreContent || crossOrigin || iframeFallback;

  useEffect(() => {
    if (ignoreContent || crossOrigin || !url) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setIframeFallback(false);
    loadHtmlContent({ url, id, filename, getFileContentUrl, staticUrl }).then(
      data => {
        if (cancelled) {
          return;
        }
        setHtml(data);
        setLoading(false);
      },
      () => {
        if (cancelled) {
          return;
        }
        setLoading(false);
        setIframeFallback(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url, id, filename, staticUrl, ignoreContent, crossOrigin, getFileContentUrl]);

  return (
    <div
      className={classnames(className, style['container'], style['container-html'])}
      style={{
        maxWidth
      }}
    >
      {useDirectIframe ? (
        <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} src={url} width="100%" sandbox={REMOTE_IFRAME_SANDBOX} className={style['html-preview-iframe']} />
      ) : loading ? (
        <div className={style['loading']}>
          <Spin />
        </div>
      ) : (
        <HtmlInnerPreviewInner {...props} url={url} data={html} />
      )}
    </div>
  );
};

const HtmlPreview = withLocale(HtmlPreviewInner);

export { HtmlPreviewInner, HtmlInnerPreviewInner };
export default HtmlPreview;
