import { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FileModalInner } from './FileModal';
import withLocale from '../../withLocale';

const FileButtonInner = p => {
  const [open, onOpenChange] = useState(false);
  const { filename, originName, id, src, title, modalProps, openDownload, openPrint, children, ...props } = Object.assign(
    {},
    {
      icon: <LinkOutlined />
    },
    p
  );
  const fileModalProps = Object.assign({}, modalProps, {
    filename: filename || originName,
    id,
    src,
    title,
    open,
    openPrint,
    openDownload,
    onCancel: () => {
      onOpenChange(false);
    }
  });

  return (
    <>
      <Button
        {...props}
        onClick={() => {
          onOpenChange(true);
        }}
      >
        {typeof children === 'function' ? children(filename || originName) : children || filename || originName}
      </Button>
      <FileModalInner {...fileModalProps} open={open} onOpenChange={onOpenChange} />
    </>
  );
};

const FileButton = withLocale(FileButtonInner);

export default FileButton;
