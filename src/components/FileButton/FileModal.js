import React, { useRef } from 'react';
import { Modal, Space, App } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import Download from '../Download';
import PrintButton from '../PrintButton';
import FilePreview, { typeFormat } from '../FilePreview';
import useControlValue from '@kne/use-control-value';
import { createIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';
import style from './style.modules.scss';

const IntlProvider = createIntlProvider('zh-CN', zhCn, 'react-file');

export const useFileModalProps = p => {
  const { title, filename, originName, openDownload, openPrint, id, src, apis, ...props } = Object.assign(
    {},
    {
      footer: null,
      openDownload: false,
      openPrint: false
    },
    p
  );
  const [open, onOpenChange] = useControlValue(props, {
    value: 'open',
    default: 'defaultOpen',
    onChange: 'onOpenChange'
  });
  const { message } = App.useApp();
  const ref = useRef();
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
        <span>
          {openDownload && (
            <IntlProvider>
              {({ formatMessage }) => (
                <Download
                  className="btn-no-padding"
                  type="link"
                  id={id}
                  src={src}
                  apis={apis}
                  filename={filename || originName}
                  onSuccess={() => {
                    message.success(formatMessage({ id: 'downloadSuccess' }));
                  }}
                />
              )}
            </IntlProvider>
          )}
          {openPrint && ['txt', 'pdf', 'image', 'html'].indexOf(typeFormat(filename || originName)) > -1 && <PrintButton contentRef={ref} type="link" icon={<PrinterOutlined />} />}
        </span>
      </Space>
    ),
    children: (
      <div ref={ref} className={style['file-modal-outer']}>
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
