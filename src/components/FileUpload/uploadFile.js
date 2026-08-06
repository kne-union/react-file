import { usePreset } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';

/**
 * 统一上传入口：解析 preset / 自定义 onUpload，并将 directory 映射为后端 path。
 * 库内上传应只走此 API，禁止直接调用 apis.file.upload / ossUpload。
 */
export const uploadFile = async ({ file, directory, onUpload, apis } = {}) => {
  const uploadFun = onUpload || apis?.file?.upload || apis?.ossUpload || apis?.upload;
  if (typeof uploadFun !== 'function') {
    throw new Error('未配置上传接口，请在 preset apis 中设置 file.upload');
  }
  const payload = Object.assign({}, { file }, directory ? { path: directory } : {});
  return uploadFun(payload);
};

export const useUploadFile = () => {
  const { apis } = usePreset();
  return useRefCallback(params => uploadFile(Object.assign({}, params, { apis: params?.apis || apis })));
};

export default uploadFile;
