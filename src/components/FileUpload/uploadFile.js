import { usePreset } from '@kne/global-context';
import useRefCallback from '@kne/use-ref-callback';
import { useFileSystemContext } from '../FileSystem/FileSystemContext';

/**
 * 统一上传入口：解析 preset / 自定义 onUpload，并将 directory 映射为后端 path。
 * 库内上传应只走此 API，禁止直接调用 apis.file.upload / ossUpload。
 * 兼容直接传 path（与后端字段同名），避免误传 path 被忽略而落到根目录。
 */
export const uploadFile = async ({ file, directory, path, onUpload, apis } = {}) => {
  const uploadFun = onUpload || apis?.file?.upload || apis?.ossUpload || apis?.upload;
  if (typeof uploadFun !== 'function') {
    throw new Error('未配置上传接口，请在 preset apis 中设置 file.upload');
  }
  const uploadDirectory = directory !== undefined && directory !== null ? directory : path;
  const payload = Object.assign({}, { file }, uploadDirectory ? { path: uploadDirectory } : {});
  return uploadFun(payload);
};

export const useUploadFile = () => {
  const { apis } = usePreset();
  const fileSystem = useFileSystemContext();
  return useRefCallback(params => {
    const hasExplicitDir = params && (params.directory !== undefined || params.path !== undefined);
    return uploadFile(
      Object.assign({}, !hasExplicitDir && fileSystem ? { directory: fileSystem.uploadPath } : null, params, {
        apis: params?.apis || apis
      })
    );
  });
};

export default uploadFile;
