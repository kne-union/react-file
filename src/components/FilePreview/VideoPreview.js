import React, { useEffect, useRef } from 'react';
import useRefCallback from '@kne/use-ref-callback';
import style from './style.module.scss';

const VideoPreview = ({ url, maxWidth, origin, controls = true, getElement, ...props }) => {
  const ref = useRef(null);
  const getElementCallback = useRefCallback(getElement);
  useEffect(() => {
    getElementCallback(ref.current);
  }, [getElementCallback]);
  if (origin) {
    return <video controls={controls} {...props} src={url} ref={ref} />;
  }
  return (
    <div
      className={style['container']}
      style={{
        maxWidth
      }}
    >
      <div className={style['video-inner']}>
        <video controls={controls} {...props} src={url} ref={ref} />
      </div>
    </div>
  );
};

export default VideoPreview;
