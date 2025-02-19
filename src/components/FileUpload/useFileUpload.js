import { useState, useMemo, useRef } from 'react';
import createDeferred from '@kne/create-deferred';
import { useContext, usePreset } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';
import { App } from 'antd';
import uniqueId from 'lodash/uniqueId';
import { createIntl } from '@kne/react-intl';

const useFileUpload = p => {
  const { locale } = useContext();
  const { formatMessage } = createIntl({ locale });
  const { multiple, fileSize, maxLength, value, concurrentCount, onAdd, onError, onSave, onChange, onUpload } = Object.assign(
    {},
    {
      concurrentCount: 1,
      value: []
    },
    p
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
      message.error(formatMessage({ id: 'maxLengthError' }, { maxLength }));
      return;
    }
    await Promise.allSettled(
      fileList.map(async file => {
        if (file.size > fileSize * 1024 * 1024) {
          message.error(formatMessage({ id: 'fileSizeError' }, { filename: file.name, fileSize }));
          return;
        }
        const uuid = uniqueId();
        const catchError = e => {
          const errMsg =
            e.message ||
            formatMessage(
              { id: 'uploadError' },
              {
                filename: file.name,
                error: e.message ? ':' + e.message : ''
              }
            );
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
            catchError(
              new Error(
                formatMessage(
                  { id: 'uploadError' },
                  {
                    filename: file.name,
                    error: data.msg ? ':' + data.msg : ''
                  }
                )
              )
            );
            return;
          }

          const outputData = onSave
            ? await Promise.resolve(onSave(data, file, uuid))
            : Object.assign({}, data.data, {
                filename: data.data.filename || data.data.originName || file.name,
                id: data.data.id,
                uuid
              });

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
              const newList = (list || []).slice(0);
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
