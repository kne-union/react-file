import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Spin } from 'antd';
import { CloudOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';
import { DocxEditorViewer, useDocxEditor, useDocxPagination } from '@extend-ai/react-docx';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import PreviewShell from './PreviewShell';
import PreviewZoomControls from './PreviewZoomControls';
import style from './style.module.scss';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// 推荐尺寸交给 DocxEditorViewer 按展示区宽度自适应计算：
// 固定 100% 时窄容器放不下 A4 页面宽度，必然出现横向滚动条。
const DEFAULT_ZOOM_MODE = 'fit-width';
// viewer 回调解析出实际百分比之前，工具栏的占位显示值
const INITIAL_ZOOM = 100;

const DocxPreviewInner = ({ url, filename, className, height = 600, showHeader = true, onRemotePreview }) => {
  const { formatMessage } = useIntl();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_MODE);
  const [resolvedZoom, setResolvedZoom] = useState(INITIAL_ZOOM);
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

  // 缩放由 viewer 自己控制，虚拟化的页面偏移会跟着同步，无需外层再套一层 CSS zoom
  const pageVirtualization = useMemo(
    () => ({
      enabled: true,
      overscan: 1,
      scrollElement: viewportElement
    }),
    [viewportElement]
  );

  const handleViewerZoomChange = useCallback(({ resolvedZoom: nextResolvedZoom }) => {
    if (Number.isFinite(nextResolvedZoom)) {
      setResolvedZoom(Math.round(nextResolvedZoom));
    }
  }, []);

  // 档位步进要基于 viewer 解析出的实际百分比（fit-width 常是非整数档），
  // 不能拿模式值参与运算，否则 +/- 会跳错档
  const handleZoomChange = useCallback(value => setZoomLevel(typeof value === 'function' ? value(resolvedZoom) : value), [resolvedZoom]);

  const handleResetZoom = useCallback(() => setZoomLevel(DEFAULT_ZOOM_MODE), []);

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

  const resetZoomLabel = formatMessage({ id: 'FilePreview.resetZoom' });

  const headerActions = useMemo(() => {
    const items = [
      <PreviewZoomControls key="zoom" zoom={resolvedZoom} onZoomChange={handleZoomChange} disabled={loading || Boolean(error)} onResetZoom={handleResetZoom} resetDisabled={zoomLevel === DEFAULT_ZOOM_MODE} resetZoomLabel={resetZoomLabel} />
    ];

    if (onRemotePreview) {
      const remoteLabel = formatMessage({ id: 'FilePreview.remotePreview' });
      items.push(
        <Button key="remote" size="small" icon={<CloudOutlined />} onClick={onRemotePreview} title={remoteLabel}>
          {isMobile ? null : remoteLabel}
        </Button>
      );
    }

    return items;
  }, [resolvedZoom, zoomLevel, handleZoomChange, handleResetZoom, loading, error, onRemotePreview, formatMessage, isMobile, resetZoomLabel]);

  return (
    <PreviewShell showHeader={showHeader} className={className} filename={displayFileName} extra={toolbarExtra} actions={headerActions} bodyRef={setViewportRef} bodyStyle={{ minHeight: height }}>
      {loading ? (
        <div className={style.loading}>
          <Spin />
        </div>
      ) : null}
      {error && !loading ? <Alert type="error" message={error} showIcon className={style.error} /> : null}
      {!loading && !error ? <DocxEditorViewer editor={editor} mode="read-only" zoom={zoomLevel} onZoomChange={handleViewerZoomChange} pageVirtualization={pageVirtualization} /> : null}
    </PreviewShell>
  );
};

const DocxPreview = withLocale(DocxPreviewInner);

export { DocxPreviewInner };
export default DocxPreview;
