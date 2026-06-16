import style from './style.module.scss';
import withLocale from '../../withLocale';

const AudioPreviewInner = ({ url, maxWidth, ...props }) => {
  return (
    <div
      className={style['container']}
      style={{
        maxWidth
      }}
    >
      <div className={style['audio-inner']}>
        <audio {...props} src={url} controls />
      </div>
    </div>
  );
};

const AudioPreview = withLocale(AudioPreviewInner);

export { AudioPreviewInner };
export default AudioPreview;
