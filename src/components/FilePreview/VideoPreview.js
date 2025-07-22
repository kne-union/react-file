import React from 'react';
import style from './style.module.scss';

const VideoPreview = ({ url, maxWidth, origin, controls = true, ...props }) => {
  if (origin) {
    return <video controls={controls} {...props} src={url} />;
  }
  return (
    <div
      className={style['container']}
      style={{
        maxWidth
      }}
    >
      <div className={style['video-inner']}>
        <video controls={controls} {...props} src={url} />
      </div>
    </div>
  );
};

export default VideoPreview;
