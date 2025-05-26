这是一个功能丰富的React文件操作组件库，提供了文件上传、预览、下载等完整的文件处理解决方案。

### 主要特性

- 🚀 **文件上传** - 支持单文件和多文件上传，可自定义文件类型限制
- 👀 **文件预览** - 支持多种文件格式的预览，包括：
  - 图片（PNG, JPG, GIF等）
  - 音频文件
  - 视频文件
  - PDF文档
  - Office文档（Word, Excel, PowerPoint）
  - HTML文件
  - 文本文件
- 📥 **文件下载** - 支持文件直接下载和blob数据下载
- 📋 **文件列表** - 提供文件列表展示和管理功能
- 🖼️ **图片处理** - 专门的图片组件，支持默认头像和加载失败处理
- 🖨️ **打印功能** - 内置打印按钮组件

### 组件概览

#### FileUpload
文件上传组件，支持单文件和多文件上传，可自定义接受的文件类型和上传限制。

#### FilePreview
文件预览组件，根据文件类型自动选择合适的预览方式。支持本地文件URL和OSS文件ID两种方式。

#### FileList
文件列表组件，用于展示和管理已上传的文件，支持预览、下载等操作。

#### Download
文件下载组件，支持多种下载方式，包括直接下载和blob数据下载。

#### Image
图片组件，支持默认头像、性别区分的头像显示，以及加载失败时的占位图。

#### FileButton
文件操作按钮组件，提供文件相关操作的统一交互界面。

#### PrintButton
打印按钮组件，用于触发打印功能。


### 快速开始

```jsx
import { FileUpload, FileList, FilePreview } from '@your-org/react-file-components';

// 文件上传示例
const UploadExample = () => (
  <FileUpload
    accept=".jpg,.png,.pdf"
    multiple
    onChange={files => console.log('Uploaded files:', files)}
  />
);

// 文件预览示例
const PreviewExample = () => (
  <FilePreview
    src="path/to/file.pdf"
    filename="example.pdf"
  />
);

// 文件列表示例
const ListExample = () => (
  <FileList
    files={[
      { id: '1', name: 'document.pdf', url: 'path/to/document.pdf' },
      { id: '2', name: 'image.jpg', url: 'path/to/image.jpg' }
    ]}
    onDelete={id => console.log('Delete file:', id)}
  />
);
```

## 注意事项

1. 确保服务器端支持相应的文件上传和处理功能
2. 文件预览功能可能需要额外的依赖或服务器支持（如Office文档预览）
