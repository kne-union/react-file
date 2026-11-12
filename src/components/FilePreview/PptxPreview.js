import { useCallback, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { Alert, Button, Segmented, Space, Spin, Tooltip } from 'antd';
import { CloudOutlined, LeftOutlined, PictureOutlined, RightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';
import { usePreset } from '@kne/global-context';
import { ReactPptxViewer, setWasmSource } from '@extend-ai/react-pptx';
import '@extend-ai/react-pptx/styles.css';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import PreviewShell from './PreviewShell';
import PreviewZoomControls from './PreviewZoomControls';
import style from './style.module.scss';

// 与 PdfPreview 的 pdfjsUrl 一致：wasm 走静态 CDN，不参与宿主打包
const DEFAULT_PPTX_WASM_URL = 'https://cdn.jsdelivr.net/npm/@extend-ai/react-pptx@0.5.0/dist/pptx_wasm_bg.wasm';

// 首次解析前就指向 CDN，避免回落到包内的 new URL('pptx_wasm_bg.wasm', import.meta.url)
setWasmSource(DEFAULT_PPTX_WASM_URL);

const SINGLE_MODE = 'slide';
const ALL_MODE = 'continuous';

const PptxPreviewInner = ({ url, filename, className, height = 600, showHeader = true, onRemotePreview, apis: propsApis, pptxWasmUrl: pptxWasmUrlProp }) => {
  const { formatMessage } = useIntl();
  const isMobile = useIsMobile();
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);
  const pptxWasmUrl = pptxWasmUrlProp || apis.file?.pptxWasmUrl || DEFAULT_PPTX_WASM_URL;

  useEffect(() => {
    setWasmSource(pptxWasmUrl);
  }, [pptxWasmUrl]);

  // 默认单页浏览（展示区左右悬浮翻页），可切到连续模式一次展示全部幻灯片
  const [mode, setMode] = useState(SINGLE_MODE);
  const [controller, setController] = useState(null);
  const [zoom, setZoom] = useState(100);
  // 当前是否处于推荐尺寸（自适应模式），用于禁用「恢复推荐尺寸」
  const [isRecommendedZoom, setIsRecommendedZoom] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [error, setError] = useState(null);
  const [viewportElement, setViewportElement] = useState(null);
  const displayFileName = filename || 'presentation.pptx';

  const setViewportRef = useCallback(node => {
    setViewportElement(node);
  }, []);

  const handleReady = useCallback(instance => {
    setController(instance);
  }, []);

  const handleLoad = useCallback(presentation => {
    setTotalSlides(presentation?.document?.slides?.length || 0);
  }, []);

  const handleSlideChange = useCallback(index => {
    setSlideIndex(index);
  }, []);

  const handleZoomChange = useCallback(({ resolvedZoom }) => {
    const nextZoom = Math.round(resolvedZoom);
    setZoom(current => (current === nextZoom ? current : nextZoom));
  }, []);

  const setZoomLevel = useCallback(
    value => {
      const nextZoom = typeof value === 'function' ? value(zoom) : value;
      setZoom(nextZoom);
      setIsRecommendedZoom(false);
      controller?.setZoom(nextZoom)?.catch?.(() => {});
    },
    [controller, zoom]
  );

  const handleModeChange = useCallback(
    nextMode => {
      setMode(nextMode);
      setIsRecommendedZoom(true);
      // 单页按整页适配；全部展示按宽度适配，避免连续滚动时每页过高
      controller?.setZoom(nextMode === SINGLE_MODE ? 'fit-page' : 'fit-width')?.catch?.(() => {});
    },
    [controller]
  );

  // 回到当前模式的初始化推荐尺寸，缩放值由 onZoomChange 同步回工具栏
  const handleResetZoom = useCallback(() => {
    setIsRecommendedZoom(true);
    controller?.setZoom(mode === SINGLE_MODE ? 'fit-page' : 'fit-width')?.catch?.(() => {});
  }, [controller, mode]);

  const modeOptions = useMemo(() => {
    const singleLabel = formatMessage({ id: 'FilePreview.pptxSinglePage' });
    const allLabel = formatMessage({ id: 'FilePreview.pptxAllSlides' });

    return [
      {
        value: SINGLE_MODE,
        label: (
          <Tooltip title={singleLabel}>
            <span className={style['pptx-mode-icon']} aria-label={singleLabel}>
              <PictureOutlined />
            </span>
          </Tooltip>
        )
      },
      {
        value: ALL_MODE,
        label: (
          <Tooltip title={allLabel}>
            <span className={style['pptx-mode-icon']} aria-label={allLabel}>
              <UnorderedListOutlined />
            </span>
          </Tooltip>
        )
      }
    ];
  }, [formatMessage]);

  // 全部展示时不需要翻页，页码与翻页控件一并隐藏
  const toolbarExtra = (
    <Space size={isMobile ? 4 : 8} align="center" wrap>
      {mode === SINGLE_MODE && totalSlides > 0 && (
        <span className={style['office-toolbar-meta']}>
          {slideIndex + 1} / {totalSlides}
        </span>
      )}
      <Segmented className={style['pptx-mode-switch']} size="small" value={mode} options={modeOptions} onChange={handleModeChange} />
    </Space>
  );

  const previousLabel = formatMessage({ id: 'FilePreview.pptxPreviousSlide' });
  const nextLabel = formatMessage({ id: 'FilePreview.pptxNextSlide' });

  // 单页模式下，翻页按钮绝对定位在展示区左右两侧（挂在滚动容器外层，不随内容滚动）
  const pagerOverlay =
    mode === SINGLE_MODE && totalSlides > 0 ? (
      <>
        <Button
          className={`${style['pptx-pager']} ${style['pptx-pager-prev']}`}
          shape="circle"
          size="large"
          icon={<LeftOutlined />}
          disabled={!controller || slideIndex <= 0}
          title={previousLabel}
          aria-label={previousLabel}
          onClick={() => controller?.previous()}
        />
        <Button
          className={`${style['pptx-pager']} ${style['pptx-pager-next']}`}
          shape="circle"
          size="large"
          icon={<RightOutlined />}
          disabled={!controller || slideIndex >= totalSlides - 1}
          title={nextLabel}
          aria-label={nextLabel}
          onClick={() => controller?.next()}
        />
      </>
    ) : null;

  const resetZoomLabel = formatMessage({ id: 'FilePreview.resetZoom' });

  const headerActions = useMemo(() => {
    const items = [<PreviewZoomControls key="zoom" zoom={zoom} onZoomChange={setZoomLevel} disabled={!controller || Boolean(error)} onResetZoom={handleResetZoom} resetDisabled={isRecommendedZoom} resetZoomLabel={resetZoomLabel} />];

    if (onRemotePreview) {
      const remoteLabel = formatMessage({ id: 'FilePreview.remotePreview' });
      items.push(
        <Button key="remote" size="small" icon={<CloudOutlined />} onClick={onRemotePreview} title={remoteLabel}>
          {isMobile ? null : remoteLabel}
        </Button>
      );
    }

    return items;
  }, [zoom, isRecommendedZoom, setZoomLevel, controller, error, onRemotePreview, formatMessage, isMobile, handleResetZoom, resetZoomLabel]);

  if (!url) {
    return <Alert type="error" message={formatMessage({ id: 'FilePreview.fileNotFoundError' })} showIcon />;
  }

  return (
    <PreviewShell showHeader={showHeader} className={className} filename={displayFileName} extra={toolbarExtra} actions={headerActions} bodyRef={setViewportRef} bodyStyle={{ minHeight: height }} overlay={pagerOverlay}>
      <ReactPptxViewer
        className={classnames(style['pptx-viewer'], { [style['pptx-viewer-single']]: mode === SINGLE_MODE })}
        source={url}
        height={height}
        mode={mode}
        defaultZoom="fit-page"
        showToolbar={false}
        virtualization={mode === ALL_MODE ? { enabled: true, scrollElement: viewportElement } : false}
        renderLoading={() => (
          <div className={style.loading}>
            <Spin />
          </div>
        )}
        renderError={loadError => <Alert type="error" message={loadError?.message || formatMessage({ id: 'FilePreview.fileLoadedError' })} showIcon className={style.error} />}
        onReady={handleReady}
        onLoad={handleLoad}
        onError={setError}
        onSlideChange={handleSlideChange}
        onZoomChange={handleZoomChange}
      />
    </PreviewShell>
  );
};

const PptxPreview = withLocale(PptxPreviewInner);

export { PptxPreviewInner };
export default PptxPreview;
