import React, { useState } from 'react';
import { Button } from 'antd';
import FileModal from './FileModal';

const FileButton = p => {
  const [open, onOpenChange] = useState(false);
  const { filename, originName, id, src, title, modalProps, ...props } = Object.assign({}, p);
  return (
    <>
      <Button
        {...props}
        onClick={() => {
          onOpenChange(true);
        }}
      />
      <FileModal
        {...modalProps}
        filename={filename || originName}
        id={id}
        src={src}
        title={title}
        open={open}
        onCancel={() => {
          onOpenChange(false);
        }}
      />
    </>
  );
};

export default FileButton;
