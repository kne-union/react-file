import useControlValue from '@kne/use-control-value';
import useFileUpload from './useFileUpload';
import { FileInputInner } from './FileInput';
import { ListInner } from '../FileList';
import defaultAccept from './defaultAccept';
import { Flex, Modal } from 'antd';
import omit from 'lodash/omit';
import style from './style.module.scss';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const FileUploadInner = p => {
  const { formatMessage } = useIntl();
  const { className, fileSize, maxLength, multiple, size, accept, children, renderTips, showUploadList, onSave, ossUpload, getPermission, concurrentCount, apis, renderModal, ...props } = Object.assign(
    {},
    {
      defaultValue: [],
      accept: defaultAccept,
      renderTips: defaultTips => {
        return defaultTips;
      },
      children: formatMessage({ id: 'FileUpload.fileUpload' }),
      multiple: true,
      showUploadList: true,
      maxLength: 10,
      fileSize: 100,
      concurrentCount: 10,
      renderModal: modalProps => <Modal {...Object.assign({}, modalProps)} />
    },
    p
  );

  const [propsValue, onChange] = useControlValue(props);
  const value = propsValue || [];

  const { fileList: uploadingList, onFileSelected } = useFileUpload({
    multiple,
    onSave,
    ossUpload,
    fileSize,
    maxLength,
    value,
    onChange,
    concurrentCount
  });
  const previewFileList = [...value, ...uploadingList];
  const tipsText = renderTips(
    formatMessage(
      { id: 'FileUpload.uploadTips' },
      {
        fileSize,
        maxLength,
        accept: accept.map(str => str.replace(/^\./, '')).join(formatMessage({ id: 'FileUpload.separator' }))
      }
    ),
    {
      fileSize,
      maxLength,
      accept
    }
  );

  return (
    <Flex vertical gap={8}>
      <Flex gap={8}>
        <FileInputInner {...omit(props, ['value', 'onChange'])} size={size} multiple={multiple} accept={accept} className={className} buttonText={children} onChange={onFileSelected} />
        {tipsText && <div className={style['tips']}>{tipsText}</div>}
      </Flex>
      {showUploadList && previewFileList.length > 0 && (
        <ListInner
          className={style['upload-list']}
          dataSource={previewFileList}
          infoItemRenders={[]}
          getPermission={
            getPermission
              ? getPermission
              : type => {
                  return ['delete', 'preview'].indexOf(type) > -1;
                }
          }
          onDelete={target => {
            const newList = value.slice(0);
            const index = newList.indexOf(target);
            index > -1 && newList.splice(index, 1);
            onChange(newList);
          }}
          apis={apis}
          renderModal={renderModal}
        />
      )}
    </Flex>
  );
};

const FileUpload = withLocale(FileUploadInner);

export default FileUpload;
