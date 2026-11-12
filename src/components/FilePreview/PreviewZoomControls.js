import { useCallback, useMemo } from 'react';
import { Button, Select, Space, Tooltip } from 'antd';
import { CompressOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';

export const PREVIEW_ZOOM_OPTIONS = [50, 75, 100, 125, 150, 200];

const formatZoomLabel = ({ label, value }) => label ?? `${value}%`;

const PreviewZoomControls = ({ zoom, onZoomChange, disabled, onResetZoom, resetZoomLabel, resetDisabled }) => {
  const isMobile = useIsMobile();

  // 自适应缩放（如 PPT 的 fit-page）解析出的百分比往往不是整数档位，
  // 需要把它补进选项，否则 Select 会直接显示裸数字、丢失 % 号
  const zoomOptions = useMemo(() => {
    const options = PREVIEW_ZOOM_OPTIONS.map(value => ({ value, label: `${value}%` }));
    if (Number.isFinite(zoom) && !options.some(option => option.value === zoom)) {
      options.push({ value: zoom, label: `${zoom}%` });
      options.sort((left, right) => left.value - right.value);
    }
    return options;
  }, [zoom]);

  const handleZoomStep = useCallback(
    direction => {
      onZoomChange(currentZoom => {
        // 当前值可能来自自适应缩放，按相邻档位递增/递减，避免 indexOf(-1) 跳到首档
        const candidates = direction > 0 ? PREVIEW_ZOOM_OPTIONS.filter(value => value > currentZoom) : PREVIEW_ZOOM_OPTIONS.filter(value => value < currentZoom).reverse();
        return candidates[0] ?? currentZoom;
      });
    },
    [onZoomChange]
  );

  return (
    <Space size={isMobile ? 4 : 8} align="center">
      {onResetZoom ? (
        <Tooltip title={resetZoomLabel}>
          <Button size="small" type="text" icon={<CompressOutlined />} disabled={disabled || resetDisabled} onClick={onResetZoom} aria-label={resetZoomLabel} />
        </Tooltip>
      ) : null}
      <Button size="small" type="text" icon={<MinusOutlined />} disabled={disabled || zoom <= PREVIEW_ZOOM_OPTIONS[0]} onClick={() => handleZoomStep(-1)} />
      <Select size="small" value={zoom} style={{ width: isMobile ? 72 : 88 }} disabled={disabled} options={zoomOptions} labelRender={formatZoomLabel} onChange={onZoomChange} />
      <Button size="small" type="text" icon={<PlusOutlined />} disabled={disabled || zoom >= PREVIEW_ZOOM_OPTIONS[PREVIEW_ZOOM_OPTIONS.length - 1]} onClick={() => handleZoomStep(1)} />
    </Space>
  );
};

export default PreviewZoomControls;
