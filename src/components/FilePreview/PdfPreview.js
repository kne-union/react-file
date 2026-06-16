import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Flex, Spin } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import style from './style.module.scss';
import useResize from '@kne/use-resize';
import { usePreset } from '@kne/global-context';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import PreviewShell from './PreviewShell';
import PreviewZoomControls from './PreviewZoomControls';

const PdfPreviewInner = p => {
  const { formatMessage } = useIntl();
  const {
    url,
    filename,
    apis: propsApis,
    maxWidth,
    scale: scaleProp,
    rotate,
    className,
    showHeader = true,
    height = 600,
    pdfjsUrl: pdfjsUrlProps
  } = Object.assign(
    {},
    {
      autoSize: true,
      renderTextLayer: false,
      scale: 100,
      rotate: 0,
      maxWidth: 1200
    },
    p
  );

  const [numPages, setNumPages] = useState(0);
  const [loadedUrl, setLoadedUrl] = useState(null);
  const [zoom, setZoom] = useState(scaleProp);
  const activeUrlRef = useRef(url);
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  const pdfjsUrl = pdfjsUrlProps || apis.file?.pdfjsUrl || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296';

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${pdfjsUrl}/build/pdf.worker.min.mjs`;
  }, [pdfjsUrl]);

  const displayFileName = useMemo(() => filename || url?.split('?')[0]?.split('/').pop() || 'document.pdf', [filename, url]);

  useEffect(() => {
    setZoom(scaleProp);
  }, [scaleProp]);

  useLayoutEffect(() => {
    activeUrlRef.current = url;
    setNumPages(0);
    setLoadedUrl(null);
  }, [url]);

  const pdfDocumentOptions = useMemo(
    () => ({
      standardFontDataUrl: `${pdfjsUrl}/standard_fonts/`,
      cMapUrl: `${pdfjsUrl}/cmaps/`,
      cMapPacked: true
    }),
    [pdfjsUrl]
  );

  const isDocumentReady = Boolean(url) && loadedUrl === url && numPages > 0;

  const [containerWidth, setContainerWidth] = useState(0);
  const updateContainerWidth = useCallback(
    el => {
      if (!el?.clientWidth) {
        return;
      }

      setContainerWidth(Math.min(el.clientWidth, maxWidth));
    },
    [maxWidth]
  );

  const ref = useResize(updateContainerWidth, { time: 16 });

  const pageWidth = containerWidth ? Math.floor((containerWidth * zoom) / 100) : null;

  const toolbarExtra = isDocumentReady ? <span className={style['office-toolbar-meta']}>1 / {numPages}</span> : null;

  return (
    <PreviewShell
      showHeader={showHeader}
      className={className}
      filename={displayFileName}
      extra={toolbarExtra}
      actions={[<PreviewZoomControls key="zoom" zoom={zoom} onZoomChange={setZoom} disabled={!isDocumentReady} />]}
      bodyRef={ref}
      bodyStyle={{ width: '100%', ...(height ? { minHeight: height } : {}) }}
    >
      <Document
        key={url}
        file={url}
        options={pdfDocumentOptions}
        error={formatMessage({ id: 'FilePreview.fileLoadedError' })}
        loading={
          <div className={style['loading']}>
            <Spin />
          </div>
        }
        noData={formatMessage({ id: 'FilePreview.fileNotFoundError' })}
        onLoadSuccess={({ numPages: nextNumPages }) => {
          if (activeUrlRef.current !== url) {
            return;
          }

          setNumPages(nextNumPages);
          setLoadedUrl(url);
        }}
      >
        <Flex vertical gap={8}>
          {isDocumentReady && pageWidth
            ? Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index}`}
                  className="preview-item"
                  pageNumber={index + 1}
                  width={pageWidth}
                  rotate={rotate}
                  loading={null}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                  noData={formatMessage({ id: 'FilePreview.pageNotFoundError' })}
                />
              ))
            : null}
        </Flex>
      </Document>
    </PreviewShell>
  );
};

const PdfPreview = memo(withLocale(PdfPreviewInner));

export { PdfPreviewInner };
export default PdfPreview;
