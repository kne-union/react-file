import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import useDownload from './useDownload';
import downloadAction from './downloadAction';
import downloadBlobFile from './downloadBlobFile';
import omit from 'lodash/omit';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';

const Download = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(p => {
  const { formatMessage } = useIntl();
  const { id, src, filename, api, onSuccess, onError, onClick, ...props } = Object.assign(
    {},
    {
      filename: formatMessage({ id: 'unnamedDownloadFile' })
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
});

Download.useDownload = useDownload;
Download.download = downloadAction;
Download.downloadBlobFile = downloadBlobFile;

export default Download;
