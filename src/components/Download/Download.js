import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useContext } from '@kne/global-context';
import useDownload from './useDownload';
import downloadAction from './downloadAction';
import downloadBlobFile from './downloadBlobFile';
import omit from 'lodash/omit';

const Download = p => {
  const { locale: contextLocale } = useContext();
  const locale = Object.assign(
    {},
    {
      未命名下载文件: '未命名下载文件'
    },
    contextLocale,
    p.locale
  );

  const { id, src, filename, api, onSuccess, onError, onClick, ...props } = Object.assign(
    {},
    {
      filename: locale['未命名下载文件']
    },
    p,
    { locale }
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

Download.useDownload = useDownload;
Download.download = downloadAction;
Download.downloadBlobFile = downloadBlobFile;

export default Download;
