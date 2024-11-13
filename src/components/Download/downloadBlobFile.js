import download from './downloadAction';
import { getAjax } from '@kne/react-fetch';

const downloadBlobFile = async (input, filename = 'file') => {
  if (!input) {
    throw new Error('未获取到下载的文件信息');
  }
  if (typeof input === 'string' && /blob:http(s)?:/.test(input)) {
    download(input, filename);
    return;
  }
  if (Object.prototype.toString.call(input) === '[object Blob]') {
    const blob = new Blob([input], {
      type: input.type
    });
    download(URL.createObjectURL(blob), filename);
    return;
  }

  const ajax = getAjax();

  const { data } = await ajax({ url: input, responseType: 'blob' });
  download(
    URL.createObjectURL(
      new Blob([data], {
        type: data?.type
      })
    ),
    filename
  );
};

export default downloadBlobFile;
