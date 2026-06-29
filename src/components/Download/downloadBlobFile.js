import download from './downloadAction';
import { getAjax } from '@kne/react-fetch';
import { createIntl } from '@kne/react-intl';

const triggerBlobDownload = (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob);
  download(blobUrl, filename);
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 0);
};

const downloadBlobFile = async (input, filename = 'file', locale) => {
  if (!input) {
    const { formatMessage } = createIntl({ locale, namespace: 'react-file' });
    throw new Error(formatMessage({ id: 'Download.notFoundFile' }));
  }
  if (typeof input === 'string' && /blob:http(s)?:/.test(input)) {
    download(input, filename);
    return;
  }
  if (Object.prototype.toString.call(input) === '[object Blob]') {
    triggerBlobDownload(
      new Blob([input], {
        type: input.type
      }),
      filename
    );
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

  triggerBlobDownload(
    new Blob([data], {
      type: data?.type
    }),
    filename
  );
};

export default downloadBlobFile;
