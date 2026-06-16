import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { CloudOutlined } from '@ant-design/icons';
import { DocxEditorViewer, useDocxEditor, useDocxPagination } from '@extend-ai/react-docx';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import PreviewShell from './PreviewShell';
import PreviewZoomControls from './PreviewZoomControls';
import style from './style.module.scss';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const DocxPreviewInner = ({ url, filename, className, height = 600, showHeader = true, onRemotePreview }) => {
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [viewportElement, setViewportElement] = useState(null);
  const displayFileName = useMemo(() => filename || 'document.docx', [filename]);

  const editor = useDocxEditor({
    initialDocumentTheme: 'light',
    initialFileName: displayFileName
  });
  const { importDocxFile } = editor;
  const { pagination } = useDocxPagination(editor);

  const setViewportRef = useCallback(node => {
    setViewportElement(node);
  }, []);

  const zoomScale = zoom / 100;

  const pageVirtualization = useMemo(
    () => ({
      enabled: true,
      overscan: 1,
      scrollElement: viewportElement,
      zoomScale
    }),
    [viewportElement, zoomScale]
  );

  const viewerZoomStyle = useMemo(
    () => ({
      zoom: zoomScale
    }),
    [zoomScale]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!url) {
        setLoading(false);
        setError(formatMessage({ id: 'FilePreview.fileNotFoundError' }));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch DOCX (${response.status})`);
        }

        const buffer = await response.arrayBuffer();
        const file = new File([buffer], displayFileName, {
          type: DOCX_MIME
        });

        await importDocxFile(file);

        if (!cancelled) {
          setLoading(false);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || formatMessage({ id: 'FilePreview.fileLoadedError' }));
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [url, displayFileName, importDocxFile, formatMessage]);

  const toolbarExtra =
    pagination.totalPages > 0 ? (
      <span className={style['office-toolbar-meta']}>
        {pagination.currentPage} / {pagination.totalPages}
      </span>
    ) : null;

  const headerActions = useMemo(() => {
    const items = [<PreviewZoomControls key="zoom" zoom={zoom} onZoomChange={setZoom} disabled={loading || Boolean(error)} />];

    if (onRemotePreview) {
      items.push(
        <Button key="remote" size="small" icon={<CloudOutlined />} onClick={onRemotePreview}>
          {formatMessage({ id: 'FilePreview.remotePreview' })}
        </Button>
      );
    }

    return items;
  }, [zoom, loading, error, onRemotePreview, formatMessage]);

  return (
    <PreviewShell showHeader={showHeader} className={className} filename={displayFileName} extra={toolbarExtra} actions={headerActions} bodyRef={setViewportRef} bodyStyle={{ minHeight: height }}>
      {loading ? (
        <div className={style.loading}>
          <Spin />
        </div>
      ) : null}
      {error && !loading ? <Alert type="error" message={error} showIcon className={style.error} /> : null}
      {!loading && !error ? (
        <div style={viewerZoomStyle}>
          <DocxEditorViewer editor={editor} mode="read-only" pageVirtualization={pageVirtualization} />
        </div>
      ) : null}
    </PreviewShell>
  );
};

const DocxPreview = withLocale(DocxPreviewInner);

export { DocxPreviewInner };
export default DocxPreview;
