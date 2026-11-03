import classnames from 'classnames';
import style from './style.module.scss';
import withLocale from '../../withLocale';

const AudioPreviewInner = ({ url, maxWidth, className, ...props }) => {
  return (
    <div
      className={classnames(className, style['container'])}
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
