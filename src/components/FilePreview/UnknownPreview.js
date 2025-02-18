import React from 'react';
import { Result } from 'antd';
import style from './style.module.scss';
import { createWithIntlProvider } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';

const UnknownPreview = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(({ maxWidth }) => {
  const { formatMessage } = useIntl();
  return (
    <div
      className={style['container']}
      style={{
        maxWidth
      }}
    >
      <div className={style['text-outer']}>
        <Result status="500" title={formatMessage({ id: 'unSupportFileType' })} subTitle={formatMessage({ id: 'unSupportFileTypeDescription' })} />
      </div>
    </div>
  );
});

export default UnknownPreview;
