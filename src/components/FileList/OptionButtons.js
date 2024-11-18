import React from 'react';
import { Flex, Button, Modal } from 'antd';
import { ConfirmButton, LoadingButton } from '@kne/button-group';
import '@kne/button-group/dist/index.css';
import DownloadButton from '../Download';
import { useFileModal } from '../FileButton';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const OptionButtons = p => {
  const {
    item,
    hasPreview,
    getPermission,
    apis,
    onEdit,
    onDelete,
    onPreview,
    renderModal: propsRenderModal
  } = Object.assign(
    {},
    {
      hasPreview: true,
      apis: {},
      getPermission: () => {
        return true;
      },
      renderModal: modalProps => <Modal {...Object.assign({}, modalProps)} />
    },
    p
  );
  const { filename, id, src } = item;

  const { onOpenChange, renderModal } = useFileModal({ apis, id, src, filename, renderModal: propsRenderModal });

  return (
    <Flex justify="end">
      {hasPreview && getPermission('preview', item) && (
        <>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              onPreview ? onPreview(item) : onOpenChange(true);
            }}
          />
          {renderModal()}
        </>
      )}
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
