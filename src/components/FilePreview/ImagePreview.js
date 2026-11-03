import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import style from './style.module.scss';
import { Button, Skeleton, Tooltip } from 'antd';
import { CompressOutlined, OneToOneOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import useResize from '@kne/use-resize';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import { useImageToolbar } from './imageToolbarContext';

const ZOOM_STEP = 1.25;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const STAGE_PADDING = 16;

const ImageViewer = ({ url, naturalSize, alt, toolbarContainer, ...props }) => {
  const { formatMessage } = useIntl();
  const [zoom, setZoom] = useState(null);
  const [rotate, setRotate] = useState(0);
  const [stageSize, setStageSize] = useState(null);

  useEffect(() => {
    setZoom(null);
    setRotate(0);
  }, [url]);

  const updateStageSize = useCallback(el => {
    if (!el?.clientWidth) {
      return;
    }
    setStageSize({ width: el.clientWidth, height: el.clientHeight });
  }, []);
  const stageRef = useResize(updateStageSize, { time: 16 });

  const rotated = rotate % 180 !== 0;
  const boxWidth = rotated ? naturalSize.height : naturalSize.width;
  const boxHeight = rotated ? naturalSize.width : naturalSize.height;
  const fitZoom = stageSize ? Math.max(MIN_ZOOM, Math.min(1, (stageSize.width - STAGE_PADDING * 2) / boxWidth, (stageSize.height - STAGE_PADDING * 2) / boxHeight)) : 1;
  const currentZoom = zoom === null ? fitZoom : zoom;
  const imageWidth = naturalSize.width * currentZoom;
  const imageHeight = naturalSize.height * currentZoom;

  const displayWidth = rotated ? imageHeight : imageWidth;
  const displayHeight = rotated ? imageWidth : imageHeight;
  const pannable = Boolean(stageSize) && (displayWidth + STAGE_PADDING * 2 > stageSize.width + 1 || displayHeight + STAGE_PADDING * 2 > stageSize.height + 1);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = e => {
    if (!pannable || e.pointerType !== 'mouse' || e.button !== 0) {
      return;
    }
    const stage = e.currentTarget;
    dragRef.current = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = e => {
    const start = dragRef.current;
    if (!start) {
      return;
    }
    e.currentTarget.scrollLeft = start.left - (e.clientX - start.x);
    e.currentTarget.scrollTop = start.top - (e.clientY - start.y);
  };

  const handlePointerUp = e => {
    if (!dragRef.current) {
      return;
    }
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const zoomTo = nextZoom => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom)));

  const actions = [
    [
      { key: 'zoomOut', icon: <ZoomOutOutlined />, disabled: currentZoom <= MIN_ZOOM, onClick: () => zoomTo(currentZoom / ZOOM_STEP) },
      { key: 'originalSize', icon: <OneToOneOutlined />, disabled: currentZoom === 1, onClick: () => setZoom(1) },
      { key: 'fitSize', icon: <CompressOutlined />, disabled: zoom === null, onClick: () => setZoom(null) },
      { key: 'zoomIn', icon: <ZoomInOutlined />, disabled: currentZoom >= MAX_ZOOM, onClick: () => zoomTo(currentZoom * ZOOM_STEP) }
    ],
    [{ key: 'rotate', icon: <RotateRightOutlined />, onClick: () => setRotate(value => value + 90) }]
  ];

  const toolbar = (
    <div className={style['image-toolbar']}>
      <span className={style['image-toolbar-zoom']}>{Math.round(currentZoom * 100)}%</span>
      {actions.map((group, index) => (
        <div key={index} className={style['image-toolbar-group']}>
          {group.map(({ key, icon, disabled, onClick }) => (
            <Tooltip key={key} title={formatMessage({ id: `FilePreview.${key}` })}>
              <Button type="text" size="small" shape="circle" icon={icon} disabled={disabled} onClick={onClick} />
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {toolbarContainer ? createPortal(toolbar, toolbarContainer) : null}
      <div
        ref={stageRef}
        className={classnames(style['image-stage'], pannable && style['image-stage-pannable'], dragging && style['image-stage-dragging'])}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={style['image-stage-box']} style={{ width: displayWidth, height: displayHeight }}>
          <img
            alt={alt}
            {...props}
            src={url}
            draggable={false}
            style={{
              width: imageWidth,
              height: imageHeight,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`
            }}
          />
        </div>
      </div>
    </>
  );
};

const ImagePreviewInner = ({ url, scale, rotate, className, maxWidth, origin, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [naturalSize, setNaturalSize] = useState(null);
  const { formatMessage } = useIntl();
  const imageToolbar = useImageToolbar();
  useEffect(() => {
    setLoading(true);
    setError(false);
    setNaturalSize(null);
    const image = new Image();
    image.src = url;
    const handlerLoad = () => {
      setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
      setLoading(false);
    };

    const handlerError = () => {
      setLoading(false);
      setError(true);
    };

    image.addEventListener('load', handlerLoad);
    image.addEventListener('error', handlerError);
    return () => {
      image.removeEventListener('load', handlerLoad);
      image.removeEventListener('error', handlerError);
    };
  }, [url, scale, rotate]);
  if (origin) {
    return <img alt={formatMessage({ id: 'FilePreview.filePreview' })} {...props} className={className} src={url} />;
  }
  const ready = !loading && !error;
  const useViewer = Boolean(imageToolbar) && ready && naturalSize?.width > 0;
  return (
    <div
      className={classnames(className, style['container'], useViewer && style['image-viewer'])}
      style={{
        maxWidth
      }}
    >
      {loading && !error ? (
        <div className={style['loading-skeleton']}>
          <Skeleton.Image active className={style['image-skeleton']} />
        </div>
      ) : null}
      {error ? <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div> : null}
      {useViewer ? <ImageViewer {...props} url={url} toolbarContainer={imageToolbar.container} naturalSize={naturalSize} alt={formatMessage({ id: 'FilePreview.filePreview' })} /> : null}
      {ready && !useViewer ? <img alt={formatMessage({ id: 'FilePreview.filePreview' })} {...props} src={url} /> : null}
    </div>
  );
};

const ImagePreview = withLocale(ImagePreviewInner);

export { ImagePreviewInner };
export default ImagePreview;
