import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import useDownload from './useDownload';
import downloadAction from './downloadAction';
import downloadBlobFile from './downloadBlobFile';
import omit from 'lodash/omit';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const DownloadInner = p => {
  const { formatMessage } = useIntl();
  const { id, src, filename, api, onSuccess, onError, onClick, ...props } = Object.assign(
    {},
    {
      filename: formatMessage({ id: 'Download.unnamedDownloadFile' })
    },
    p
  );

  const { isLoading, download } = useDownload({
    id,
    src,
    filename,
    api,
    onError,
    onSuccess
  });

  return (
    <Button
      icon={<DownloadOutlined />}
      {...omit(props, ['locale'])}
      loading={isLoading}
      onClick={(...args) => {
        onClick && onClick(...args);
        download();
      }}
    />
  );
};

const Download = withLocale(DownloadInner);

Download.useDownload = useDownload;
Download.download = downloadAction;
Download.downloadBlobFile = downloadBlobFile;

export { DownloadInner };
export default Download;
