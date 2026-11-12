import { useMemo } from 'react';
import { Alert, Button, Select, Space, Spin, Tabs, Tooltip } from 'antd';
import { CloudOutlined, CompressOutlined, DownloadOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';
import { XlsxViewer } from '@extend-ai/react-xlsx';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import PreviewHeader from './PreviewHeader';
import style from './style.module.scss';

const ZOOM_OPTIONS = [50, 75, 100, 125, 150, 200];

const buildZoomOptions = controller => {
  const options = ZOOM_OPTIONS.filter(value => value >= controller.minZoomScale && value <= controller.maxZoomScale).map(value => ({
    value,
    label: `${value}%`
  }));

  if (!options.some(option => option.value === controller.zoomScale)) {
    options.push({
      value: controller.zoomScale,
      label: `${controller.zoomScale}%`
    });
    options.sort((left, right) => left.value - right.value);
  }

  return options;
};

const formatZoomLabel = ({ label, value }) => label ?? `${value}%`;

const XlsxToolbar = ({ controller, fileName, onRemotePreview, remotePreviewLabel, resetZoomLabel }) => {
  const isMobile = useIsMobile();
  const zoomOptions = useMemo(() => buildZoomOptions(controller), [controller]);
  // resetZoom 清除当前 sheet 的缩放覆盖后回到 defaultZoomScale，
  // 因此「已处于推荐尺寸」等价于当前缩放等于 defaultZoomScale（与组件内置工具栏判定一致）
  const isRecommendedZoom = Number.isFinite(controller.defaultZoomScale) && Math.round(controller.zoomScale) === Math.round(controller.defaultZoomScale);

  const sheetTabs =
    controller.sheets?.length > 1 ? (
      <Tabs
        size="small"
        className={style['office-sheet-tabs']}
        activeKey={String(controller.activeSheetIndex)}
        items={controller.sheets.map((sheet, index) => ({
          key: String(index),
          label: sheet.name
        }))}
        onChange={key => controller.setActiveSheetIndex(Number(key))}
      />
    ) : null;

  const headerActions = useMemo(() => {
    const items = [
      <Space key="zoom" size={4} align="center">
        <Tooltip title={resetZoomLabel}>
          <Button size="small" type="text" icon={<CompressOutlined />} disabled={isRecommendedZoom} onClick={() => controller.resetZoom()} aria-label={resetZoomLabel} />
        </Tooltip>
        <Button size="small" type="text" icon={<MinusOutlined />} disabled={!controller.canZoomOut} onClick={() => controller.zoomOut()} />
        <Select size="small" value={controller.zoomScale} style={{ width: isMobile ? 72 : 88 }} options={zoomOptions} labelRender={formatZoomLabel} onChange={value => controller.setZoomScale(Number(value))} />
        <Button size="small" type="text" icon={<PlusOutlined />} disabled={!controller.canZoomIn} onClick={() => controller.zoomIn()} />
        <Button size="small" type="text" icon={<DownloadOutlined />} disabled={!controller.canDownload} onClick={() => controller.download()} />
      </Space>
    ];

    if (onRemotePreview) {
      items.push(
        <Button key="remote" size="small" icon={<CloudOutlined />} onClick={onRemotePreview} title={remotePreviewLabel}>
          {isMobile ? null : remotePreviewLabel}
        </Button>
      );
    }

    return items;
  }, [controller, isMobile, isRecommendedZoom, onRemotePreview, remotePreviewLabel, resetZoomLabel, zoomOptions]);

  return (
    <div className={style['office-toolbar-stack']}>
      <PreviewHeader filename={fileName || controller.displayFileName} actions={headerActions} />
      {sheetTabs}
    </div>
  );
};

const XlsxPreviewInner = ({ url, filename, className, height = 600, showHeader = true, onRemotePreview }) => {
  const { formatMessage } = useIntl();

  if (!url) {
    return <Alert type="error" message={formatMessage({ id: 'FilePreview.fileNotFoundError' })} showIcon />;
  }

  return (
    <div className={classnames(className, style.container, style['office-preview'])}>
      <XlsxViewer
        src={url}
        fileName={filename}
        readOnly
        isDark={false}
        height={height}
        rounded={false}
        showDefaultToolbar={false}
        loadingState={
          <div className={style.loading}>
            <Spin />
          </div>
        }
        errorState={error => <Alert type="error" message={error?.message || formatMessage({ id: 'FilePreview.fileLoadedError' })} showIcon />}
        toolbar={controller => {
          if (!showHeader) {
            return null;
          }
          return (
            <XlsxToolbar
              key={controller.revision}
              controller={controller}
              fileName={filename}
              onRemotePreview={onRemotePreview}
              remotePreviewLabel={formatMessage({ id: 'FilePreview.remotePreview' })}
              resetZoomLabel={formatMessage({ id: 'FilePreview.resetZoom' })}
            />
          );
        }}
      />
    </div>
  );
};

const XlsxPreview = withLocale(XlsxPreviewInner);

export { XlsxPreviewInner };
export default XlsxPreview;
