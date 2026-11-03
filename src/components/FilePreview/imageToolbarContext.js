import { createContext, useContext } from 'react';

// value: { container } 图片操作条 portal 的挂载节点（如弹窗标题栏）
const ImageToolbarContext = createContext(null);

export const ImageToolbarProvider = ImageToolbarContext.Provider;

export const useImageToolbar = () => useContext(ImageToolbarContext);
