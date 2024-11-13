import React from 'react';
import useControlValue from '@kne/use-control-value';
import useFileUpload from './useFileUpload';
import FileInput from './FileInput';
import FileList from '../FileList';
import defaultAccept from './defaultAccept';
import { Flex } from 'antd';
import omit from 'lodash/omit';
import style from './style.module.scss';

const FileUpload = p => {
  const { className, fileSize, maxLength, multiple, size, accept, children, renderTips, showUploadList, onSave, ossUpload, getPermission, concurrentCount, apis, ...props } = Object.assign(
    {},
    {
      defaultValue: [],
      accept: defaultAccept,
      renderTips: defaultTips => {
        return defaultTips;
      },
      children: '上传文件',
      multiple: true,
      showUploadList: true,
      maxLength: 10,
      fileSize: 30,
      concurrentCount: 10
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

  const previewFileList = [...uploadingList, ...value];

  const tipsText = renderTips(`支持扩展名${accept.map(str => str.replace(/^\./, '')).join('、')},单个文件大小不超过${fileSize}M，最多上传${maxLength}个附件`, {
    fileSize,
    maxLength,
    accept
  });

  return (
    <Flex vertical gap={8}>
      <Flex gap={8}>
        <FileInput {...omit(props, ['value', 'onChange'])} size={size} multiple={multiple} accept={accept} className={className} buttonText={children} onChange={onFileSelected} />
        {tipsText && <div className={style['tips']}>{tipsText}</div>}
      </Flex>
      {showUploadList && previewFileList.length > 0 && (
        <FileList
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
        />
      )}
    </Flex>
  );
};

export default FileUpload;
