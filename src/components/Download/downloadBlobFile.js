import download from './downloadAction';
import { getAjax } from '@kne/react-fetch';

const downloadBlobFile = async (input, filename = 'file', locale) => {
  if (!input) {
    throw new Error(locale?.notFoundFile || '未获取到下载的文件信息');
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

  const { data, headers } = await ajax({ url: input, responseType: 'blob' });

  const contentDisposition = headers?.['content-disposition'];

  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
    if (fileNameMatch && fileNameMatch[1]) {
      filename = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''));
    } else {
      const fallbackMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
      if (fallbackMatch) filename = fallbackMatch[1];
    }
  }

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
