import { useCallback } from 'react';
import { Button, Select, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

export const PREVIEW_ZOOM_OPTIONS = [50, 75, 100, 125, 150, 200];

const PreviewZoomControls = ({ zoom, onZoomChange, disabled }) => {
  const handleZoomStep = useCallback(
    direction => {
      onZoomChange(currentZoom => {
        const currentIndex = PREVIEW_ZOOM_OPTIONS.indexOf(currentZoom);
        const nextIndex = Math.min(Math.max(currentIndex + direction, 0), PREVIEW_ZOOM_OPTIONS.length - 1);
        return PREVIEW_ZOOM_OPTIONS[nextIndex];
      });
    },
    [onZoomChange]
  );

  return (
    <Space size={8} align="center">
      <Button size="small" type="text" icon={<MinusOutlined />} disabled={disabled || zoom <= PREVIEW_ZOOM_OPTIONS[0]} onClick={() => handleZoomStep(-1)} />
      <Select
        size="small"
        value={zoom}
        style={{ width: 88 }}
        disabled={disabled}
        options={PREVIEW_ZOOM_OPTIONS.map(value => ({
          value,
          label: `${value}%`
        }))}
        onChange={onZoomChange}
      />
      <Button size="small" type="text" icon={<PlusOutlined />} disabled={disabled || zoom >= PREVIEW_ZOOM_OPTIONS[PREVIEW_ZOOM_OPTIONS.length - 1]} onClick={() => handleZoomStep(1)} />
    </Space>
  );
};

export default PreviewZoomControls;
