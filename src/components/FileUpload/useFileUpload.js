import { useState, useMemo, useRef } from 'react';
import createDeferred from '@kne/create-deferred';
import { useContext, usePreset } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';
import { App } from 'antd';
import uniqueId from 'lodash/uniqueId';

const useFileUpload = p => {
  const { locale: contextLocale } = useContext();
  const locale = Object.assign(
    {},
    {
      '上传文件不能超过最大允许数量%s': '上传文件不能超过最大允许数量%s',
      '文件%s不能超过%sMB!': '文件%s不能超过%sMB!',
      '文件%s上传错误%s': '文件%s上传错误%s',
      '文件%s上传异常%s': '文件%s上传异常%s'
    },
    contextLocale,
    p.locale
  );

  const { multiple, fileSize, maxLength, value, concurrentCount, onAdd, onError, onSave, onChange, onUpload } = Object.assign(
    {},
    {
      concurrentCount: 1,
      value: []
    },
    p,
    { locale }
  );

  const { apis } = usePreset();
  const { message } = App.useApp();
  const [uploadingList, setUploadingList] = useState([]);
  const concurrentCountRef = useRef(concurrentCount);
  const deferred = useMemo(() => {
    return createDeferred(concurrentCountRef.current);
  }, []);

  const onFileSelected = useRefCallback(async fileList => {
    const allowCount = maxLength - value.length;
    if (!(maxLength === 1 || multiple !== true) && fileList.length > allowCount) {
      message.error(locale['上传文件不能超过最大允许数量%s'].replace('%s', maxLength));
      return;
    }
    await Promise.allSettled(
      fileList.map(async file => {
        if (file.size > fileSize * 1024 * 1024) {
          message.error((values => locale['文件%s不能超过%sMB!'].replace(/%s/g, () => values.shift()))([file.name, fileSize]));
          return;
        }
        const uuid = uniqueId();
        const catchError = e => {
          const errMsg = e.message || (values => locale['文件%s上传错误%s'].replace(/%s/g, () => values.shift()))([file.name, e.message ? ':' + e.message : '']);
          message.error(errMsg);
          onError && onError({ file, error: e, errMsg });
          setUploadingList(list => {
            const newList = list.slice(0);
            const index = newList.findIndex(item => item.uuid === uuid);
            index > -1 && newList.splice(index, 1);
            return newList;
          });
        };

        try {
          if (maxLength === 1 || multiple !== true) {
            setUploadingList([
              {
                uuid,
                type: 'uploading',
                filename: file.name
              }
            ]);
          } else {
            setUploadingList(list => {
              const newList = list.slice(0);
              newList.unshift({
                uuid,
                type: 'uploading',
                filename: file.name
              });
              return newList;
            });
          }
          onAdd && (await Promise.resolve(onAdd(file)));
          const uploadFun = onUpload ? onUpload : apis.file?.upload;
          const { data } = await deferred(() => uploadFun({ file }));

          if (data.code !== 0) {
            catchError(new Error((values => locale['文件%s上传异常%s'].replace(/%s/g, () => values.shift()))([file.name, data.msg ? ':' + data.msg : ''])));
            return;
          }

          const outputData = onSave
            ? await Promise.resolve(onSave(data, file, uuid))
            : {
                filename: data.data.filename || data.data.originName || file.name,
                id: data.data.id,
                uuid
              };

          setUploadingList(list => {
            const newList = list.slice(0);
            const index = newList.findIndex(item => item.uuid === uuid);
            index > -1 && newList.splice(index, 1);
            return newList;
          });
          if (maxLength === 1 || multiple !== true) {
            onChange([outputData]);
          } else {
            onChange(list => {
              const newList = list.slice(0);
              newList.push(outputData);
              return newList;
            });
          }
        } catch (e) {
          catchError(e);
        }
      })
    );
  });

  return {
    fileList: uploadingList,
    onFileSelected
  };
};

export default useFileUpload;
