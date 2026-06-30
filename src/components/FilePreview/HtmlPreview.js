import iFrameResize from '@kne/iframe-resizer';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import style from './style.module.scss';
import { getAjax } from '@kne/react-fetch';
import { Spin } from 'antd';
import { usePreset } from '@kne/global-context';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import { formatStaticUrl, toAjaxUrl } from '../../common/useStaticUrl';
import { sanitizeHtmlDocument } from '../../common/sanitizeHtml';

const SRCDOC_IFRAME_SANDBOX = 'allow-scripts allow-same-origin';
const REMOTE_IFRAME_SANDBOX = 'allow-same-origin allow-scripts allow-popups';
const DOCUMENT_IFRAME_STYLE = 'html,body{height:auto!important;margin:0;}body{background:#FFFFFF;}';

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
      const { data } = await ajax({ url: toAjaxUrl(candidate, ajax), method: 'GET', responseType: 'text' });
      if (typeof data === 'string' && data.trim()) {
        return data;
      }
    } catch (error) {
      lastError = error?.message || 'Failed to load HTML';
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
    styleNode.innerText = DOCUMENT_IFRAME_STYLE;
    domDocument.head.appendChild(styleNode);
    ref.current.srcdoc = domDocument.documentElement.outerHTML;
    try {
      resizeRef.current = iFrameResize({ checkOrigin: false, minHeight: 600 }, ref.current);
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
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(!ignoreContent);
  const [error, setError] = useState(false);
  const isOfficeIframePreview = ignoreContent && classnames(className).includes(style['office-iframe-preview']);

  useEffect(() => {
    if (ignoreContent || !url) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
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
        setError(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url, id, filename, staticUrl, ignoreContent, getFileContentUrl]);

  return (
    <div
      className={classnames(className, style['container'], style['container-html'], !ignoreContent && style['html-preview-document'])}
      style={{
        maxWidth
      }}
    >
      {ignoreContent ? (
        isOfficeIframePreview ? (
          <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} src={url} width="100%" sandbox={REMOTE_IFRAME_SANDBOX} className={style['html-preview-iframe']} />
        ) : (
          <div className={style['html-preview-document-body']}>
            <iframe title={formatMessage({ id: 'FilePreview.filePreview' })} src={url} width="100%" sandbox={REMOTE_IFRAME_SANDBOX} className={style['html-preview-iframe']} />
          </div>
        )
      ) : loading ? (
        <div className={style['loading']}>
          <Spin />
        </div>
      ) : error ? (
        <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div>
      ) : (
        <HtmlInnerPreviewInner {...props} url={url} data={html} />
      )}
    </div>
  );
};

const HtmlPreview = withLocale(HtmlPreviewInner);

export { HtmlPreviewInner, HtmlInnerPreviewInner };
export default HtmlPreview;
