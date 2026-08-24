import { createContext, useContext } from 'react';

const FileSystemContext = createContext(null);

export const useFileSystemContext = () => useContext(FileSystemContext);

export default FileSystemContext;
