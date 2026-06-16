import { Result } from 'antd';
import style from './style.module.scss';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const UnknownPreviewInner = ({ maxWidth }) => {
  const { formatMessage } = useIntl();
  return (
    <div
      className={style['container']}
      style={{
        maxWidth
      }}
    >
      <div className={style['text-outer']}>
        <Result status="500" title={formatMessage({ id: 'FilePreview.unSupportFileType' })} subTitle={formatMessage({ id: 'FilePreview.unSupportFileTypeDescription' })} />
      </div>
    </div>
  );
};

const UnknownPreview = withLocale(UnknownPreviewInner);

export { UnknownPreviewInner };
export default UnknownPreview;
