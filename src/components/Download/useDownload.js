import { useState, useEffect } from 'react';
import { App } from 'antd';
import { usePreset } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';
import { useFetch } from '@kne/react-fetch';
import downloadBlobFile from './downloadBlobFile';
import { formatStaticUrl } from '../../common/useStaticUrl';

const useDownload = ({ id, src, filename, staticUrl: staticUrlProps, apis: currentApis, onError, onSuccess }) => {
  const { message } = App.useApp();
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, currentApis);
  const staticUrl = staticUrlProps || apis.file?.staticUrl || '';
  const [downLoading, setDownLoading] = useState(false);
  const { paramsType, paramsName, ...fileApi } = Object.assign(
    {
      paramsType: 'params',
      paramsName: 'id'
    },
    apis.file?.getUrl
  );
  const fetchProps = {};
  fetchProps[paramsType] = { [paramsName]: id };
  const { isLoading, data, error, refresh, ...otherProps } = useFetch(Object.assign({}, fileApi, fetchProps, { auto: false }));

  const showError = useRefCallback(onError || message.error);
  const successHandler = useRefCallback(onSuccess);
  const downloadHandler = useRefCallback(src => {
    return downloadBlobFile(formatStaticUrl({ staticUrl, url: src }), filename)
      .then(successHandler)
      .catch(e => {
        showError(e.message);
      });
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (error) {
      showError(error);
      return;
    }
    if (!data) {
      return;
    }
    setDownLoading(true);
    downloadHandler(data).then(() => {
      setDownLoading(false);
    });
  }, [isLoading, error, data, showError]);

  return {
    ...otherProps,
    isLoading: isLoading || downLoading,
    download: () => {
      if (src) {
        return downloadHandler(src);
      }
      return refresh(id ? fetchProps : {});
    }
  };
};

export default useDownload;
