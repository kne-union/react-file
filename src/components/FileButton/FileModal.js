import { useRef } from 'react';
import { Modal, Space, App } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { DownloadInner } from '../Download';
import { PrintButtonInner } from '../PrintButton';
import { FilePreviewInner, typeFormat } from '../FilePreview';
import useControlValue from '@kne/use-control-value';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import style from './style.module.scss';
import previewStyle from '../FilePreview/style.module.scss';

export const useFileModalProps = p => {
  const { formatMessage } = useIntl();
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
            <DownloadInner
              className="btn-no-padding"
              type="link"
              id={id}
              src={src}
              apis={apis}
              filename={filename || originName}
              onSuccess={() => {
                message.success(formatMessage({ id: 'Download.downloadSuccess' }));
              }}
            />
          )}
          {openPrint && ['txt', 'pdf', 'image', 'html'].indexOf(typeFormat(filename || originName)) > -1 && <PrintButtonInner contentRef={ref} type="link" icon={<PrinterOutlined />} />}
        </span>
      </Space>
    ),
    children: (
      <div ref={ref} className={style['file-modal-outer']}>
        <FilePreviewInner id={id} src={src} filename={filename || originName} apis={apis} className={previewStyle['modal-preview']} />
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

const FileModalInner = p => {
  const { renderModal } = useFileModal(p);
  return renderModal();
};

export { FileModalInner };
export default withLocale(FileModalInner);
