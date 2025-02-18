import React, { useRef } from 'react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import style from './style.module.scss';
import defaultAccept from './defaultAccept';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';

const FileInput = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(p => {
  const { formatMessage } = useIntl();
  const ref = useRef(null);
  const { children, className, buttonText, accept, multiple, onChange, ...props } = Object.assign(
    {},
    {
      accept: defaultAccept,
      buttonText: formatMessage({ id: 'fileUpload' }),
      children: ({ children, ...props }) => {
        return (
          <Button icon={<UploadOutlined />} {...props}>
            {buttonText}
            {children}
          </Button>
        );
      }
    },
    p
  );

  const resetFileInput = () => {
    ref.current.setAttribute('type', 'text');
    ref.current.setAttribute('type', 'file');
  };

  return children({
    ...props,
    className: classnames(className, style['input-file']),
    children: !props.disabled && (
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className={style['input-file-input']}
        onChange={e => {
          const fileList = [].slice.call(e.target.files, 0);
          if (fileList.length === 0) {
            return;
          }
          resetFileInput();
          onChange(fileList);
        }}
      />
    )
  });
});

export default FileInput;
