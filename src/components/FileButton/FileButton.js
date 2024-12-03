import React, { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import FileModal from './FileModal';

const FileButton = p => {
  const [open, onOpenChange] = useState(false);
  const { filename, originName, id, src, title, modalProps, openDownload, children, ...props } = Object.assign(
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
      <FileModal {...fileModalProps} open={open} onOpenChange={onOpenChange} />
    </>
  );
};

export default FileButton;
