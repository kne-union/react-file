import React from 'react';
import { Flex } from 'antd';
import { ConfirmButton, LoadingButton } from '@kne/button-group';
import '@kne/button-group/dist/index.css';
import DownloadButton from '../Download';
import FileButton from '../FileButton';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const OptionButtons = p => {
  const { item, hasPreview, getPermission, apis, onEdit, onDelete } = Object.assign(
    {},
    {
      hasPreview: true,
      apis: {},
      getPermission: () => {
        return true;
      }
    },
    p
  );
  const { filename, id, src } = item;

  return (
    <Flex justify="end">
      {hasPreview && getPermission('preview', item) && <FileButton type="text" icon={<EyeOutlined />} apis={apis} id={id} src={src} filename={filename} />}
      {getPermission('edit', item) && (
        <LoadingButton
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            return onEdit && onEdit(item);
          }}
        />
      )}
      {getPermission('download', item) && <DownloadButton type="text" id={id} src={src} filename={filename} />}
      {getPermission('delete', item) && (
        <ConfirmButton
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => {
            return onDelete && onDelete(item);
          }}
        />
      )}
    </Flex>
  );
};

export default OptionButtons;
