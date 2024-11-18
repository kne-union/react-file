import React from 'react';
import { Modal, Space, App } from 'antd';
import Download from '../Download';
import FilePreview from '../FilePreview';
import { useContext } from '@kne/global-context';
import useControlValue from '@kne/use-control-value';
import style from './style.modules.scss';

export const useFileModalProps = p => {
  const { locale: contextLocale } = useContext();
  const locale = Object.assign(
    {},
    {
      下载成功: '下载成功'
    },
    contextLocale,
    p.locale
  );
  const { title, filename, originName, openDownload, id, src, apis, ...props } = Object.assign(
    {},
    {
      footer: null,
      openDownload: true
    },
    p
  );
  const [open, onOpenChange] = useControlValue(props, {
    value: 'open',
    default: 'defaultOpen',
    onChange: 'onOpenChange'
  });
  const { message } = App.useApp();
  return {
    ...props,
    open,
    onOpenChange,
    onCancel: () => {
      onOpenChange(false);
    },
    title: (
      <Space size={10} className={style['file-title']}>
        <span className={style['ellipse']}>{title || filename || originName}</span>
        {openDownload && (
          <Download
            className="btn-no-padding"
            type="link"
            id={id}
            src={src}
            apis={apis}
            filename={filename || originName}
            onSuccess={() => {
              message.success(locale['下载成功']);
            }}
          />
        )}
      </Space>
    ),
    children: (
      <div className={style['file-modal-outer']}>
        <FilePreview id={id} src={src} filename={filename || originName} apis={apis} />
      </div>
    )
  };
};

export const useFileModal = p => {
  const { renderModal, ...props } = Object.assign(
    {},
    {
      renderModal: modalProps => <Modal {...Object.assign({}, modalProps)} />
    },
    p
  );
  const fileProps = useFileModalProps(props);

  return Object.assign({}, fileProps, { renderModal: props => renderModal(Object.assign({}, fileProps, props)) });
};

const FileModal = p => {
  const { renderModal } = useFileModal(p);
  return renderModal();
};

export default FileModal;
