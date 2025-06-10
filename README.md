
# react-file


### 描述

提供了文件上传，文件预览，文件批量管理等功能


### 安装

```shell
npm i --save @kne/react-file
```


### 概述

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


### 示例(全屏)

#### 示例代码

- File
- 从oss获取文件地址
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),remoteLoader(@kne/remote-loader)

```jsx
const { default: File } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('/logo192.png');
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <File id="123">{({ url }) => {
      return url;
    }}</File>
  </PureGlobal>;
});

render(<BaseExample />);

```

- Image
- 显示图片
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { Image } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Divider } = antd;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('/mock/avatar.png');
              }, 2000);
            });
          }
        }
      }
    }
  }}>
    <InfoPage>
      <InfoPage.Part title="图片">
        <Image src="xxxxxx" />
        <Image id="xxxxxx" style={{ width: 200, height: 200 }} />
      </InfoPage.Part>
      <InfoPage.Part title="头像">
        <Image.Avatar gender="F" />
        <Image.Avatar gender="M" />
        <Image.Avatar />
        <Image.Avatar gender="F" id="xxxxxx" />
        <Divider />
        <Image.Avatar gender="F" shape="square" />
        <Image.Avatar gender="M" shape="square" />
        <Image.Avatar shape="square" />
        <Image.Avatar gender="F" id="xxxxxx" shape="square" />
        <Divider />
        <Image.Avatar gender="F" size={30} />
        <Image.Avatar gender="M" size={50} />
        <Image.Avatar size={80} />
        <Image.Avatar gender="F" id="xxxxxx" size={100} />
      </InfoPage.Part>
    </InfoPage>
  </PureGlobal>;
});

render(<BaseExample />);

```

- Download
- 文件下载
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { Download } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Flex } = antd;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('/logo192.png');
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <Flex gap={8}>
      <Download id="123">下载文件</Download>
      <Download id="123" filename="图片">下载文件并设置名称</Download>
      <Download src="/logo192.png" filename="图片">直接通过src链接下载</Download>
    </Flex>
  </PureGlobal>;
});

render(<BaseExample />);

```

- FileButton
- 预览文件按钮
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileButton } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/resume.png',
              2: '/mock/resume.pdf',
              3: '/mock/resume.html',
              4: '/mock/resume.txt',
              5: '/mock/audio.wav',
              6: '/mock/resume.docx'
            };
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(urlMap[params.id]);
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <FileButton id="1" filename="demo.jpg" openPrint modalProps={{ width: 800 }}>预览demo.jpg</FileButton>
    <FileButton id="2" filename="demo2.pdf" openPrint modalProps={{ width: 800 }}>预览demo2.pdf</FileButton>
    <FileButton id="3" filename="demo2.html" openPrint modalProps={{ width: 800 }}>预览demo2.html</FileButton>
    <FileButton id="6" filename="resume.docx" openPrint modalProps={{ width: 800 }} type="link">resume.docx</FileButton>
  </PureGlobal>;
});

render(<BaseExample />);

```

- FileList
- 文件列表
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileList } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Divider } = antd;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/resume.png',
              2: '/mock/resume.pdf',
              3: '/mock/resume.html',
              4: '/mock/resume.txt',
              5: '/mock/audio.wav',
              6: '/mock/resume.docx'
            };
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(urlMap[params.id]);
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <FileList dataSource={[{
      uuid: '121233',
      type: 'uploading',
      filename: '张三的简历.doc'
    },
      {
        id: '2',
        filename: '我是一份简历.pdf',
        date: '2022-07-15T11:09:15.000+08:00',
        userName: '用户名'
      }]} />
    <Divider />
    <FileList dataSource={[]} />
  </PureGlobal>;
});

render(<BaseExample />);

```

- FileUpload
- 文件上传
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileUpload } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const urls = {};

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
        getUrl: {
          loader: async ({ params }) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(urls[params.id]);
              }, 1000);
            });
          }
        }, upload: ({ file }) => {
          urls[file.name] = URL.createObjectURL(file);
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  code: 0, data: {
                    id: file.name, filename: file.name
                  }
                }
              });
            }, 1000);
          });
        }
      }
    }
  }}>
    <FileUpload />
  </PureGlobal>;
});

render(<BaseExample />);

```

- FilePreview
- 文件预览
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FilePreview } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL, getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/resume.png',
              2: '/mock/resume.pdf',
              3: '/mock/resume.html',
              4: '/mock/resume.txt',
              5: '/mock/audio.wav',
              6: 'http://ieee802.org:80/secmail/docIZSEwEqHFr.doc'
            };
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(urlMap[params.id]);
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <InfoPage>
      <InfoPage.Part title="预览图片">
        <FilePreview id="1" />
      </InfoPage.Part>
      <InfoPage.Part title="预览PDF">
        <FilePreview id="2" />
      </InfoPage.Part>
      <InfoPage.Part title="预览HTML">
        <FilePreview id="3" />
      </InfoPage.Part>
      <InfoPage.Part title="预览TXT">
        <FilePreview id="4" />
      </InfoPage.Part>
      <InfoPage.Part title="预览AUDIO">
        <FilePreview id="5" />
      </InfoPage.Part>
      <InfoPage.Part title="预览OFFICE">
        <FilePreview id="6" />
      </InfoPage.Part>
    </InfoPage>

  </PureGlobal>;
});

render(<BaseExample />);

```


### API

### FileUpload

文件上传组件，支持单文件和多文件上传。

#### 属性

| 属性       | 类型        | 默认值       | 描述                         |
|----------|-----------|-----------|----------------------------|
| accept   | string    | undefined | 接受的文件类型，如 ".jpg,.png,.pdf" |
| multiple | boolean   | false     | 是否支持多文件上传                  |
| onChange | function  | -         | 文件选择后的回调函数，参数为选择的文件数组      |
| disabled | boolean   | false     | 是否禁用上传功能                   |
| maxSize  | number    | -         | 单个文件最大尺寸（字节）               |
| children | ReactNode | -         | 自定义上传按钮内容                  |

### FilePreview

文件预览组件，支持多种文件格式的预览。

#### 属性

| 属性        | 类型     | 默认值 | 描述                   |
|-----------|--------|-----|----------------------|
| url       | string | -   | 文件URL                |
| filename  | string | -   | 文件名，用于确定文件类型         |
| type      | string | -   | 文件类型，可选，如不提供则根据文件名推断 |
| staticUrl | string | -   | 静态资源URL前缀            |
| apis      | object | -   | API配置对象              |

### FileList

文件列表组件，用于展示和管理文件。

#### 属性

| 属性         | 类型       | 默认值 | 描述          |
|------------|----------|-----|-------------|
| files      | array    | []  | 文件列表数据      |
| onDelete   | function | -   | 删除文件的回调函数   |
| onPreview  | function | -   | 预览文件的回调函数   |
| onDownload | function | -   | 下载文件的回调函数   |
| renderItem | function | -   | 自定义渲染文件项的函数 |

### Download

文件下载组件。

#### 属性

| 属性        | 类型        | 默认值 | 描述        |
|-----------|-----------|-----|-----------|
| url       | string    | -   | 下载文件的URL  |
| filename  | string    | -   | 下载后的文件名   |
| children  | ReactNode | -   | 触发下载的元素   |
| onSuccess | function  | -   | 下载成功的回调函数 |
| onError   | function  | -   | 下载失败的回调函数 |

### Image

图片组件，支持默认头像和加载失败处理。

#### 属性

| 属性            | 类型       | 默认值 | 描述                                |
|---------------|----------|-----|-----------------------------------|
| src           | string   | -   | 图片源URL                            |
| alt           | string   | -   | 图片替代文本                            |
| defaultAvatar | string   | -   | 默认头像类型（'male'/'female'/'default'） |
| onError       | function | -   | 图片加载失败的回调函数                       |
| className     | string   | -   | 自定义类名                             |
| style         | object   | -   | 自定义样式                             |

### FileButton

文件操作按钮组件。

#### 属性

| 属性        | 类型        | 默认值   | 描述        |
|-----------|-----------|-------|-----------|
| onClick   | function  | -     | 点击按钮的回调函数 |
| disabled  | boolean   | false | 是否禁用按钮    |
| children  | ReactNode | -     | 按钮内容      |
| className | string    | -     | 自定义类名     |

### PrintButton

打印按钮组件。

#### 属性

| 属性            | 类型        | 默认值 | 描述       |
|---------------|-----------|-----|----------|
| onBeforePrint | function  | -   | 打印前的回调函数 |
| onAfterPrint  | function  | -   | 打印后的回调函数 |
| children      | ReactNode | -   | 按钮内容     |

### 类型定义

#### FileType

```typescript
interface FileType {
  id: string;
  name: string;
  url?: string;
  size?: number;
  type?: string;
  lastModified?: number;
}
```

#### APIConfig

```typescript
interface APIConfig {
  file?: {
    staticUrl?: string;
    upload?: string;
    download?: string;
  };
}
```

### Hooks

#### useFileUpload

用于处理文件上传逻辑的自定义Hook。

```typescript
const {
  uploadFile,
  isUploading,
  progress,
  error
} = useFileUpload(config);
```

#### useDownload

用于处理文件下载逻辑的自定义Hook。

```typescript
const {
  download,
  isDownloading,
  error
} = useDownload(config);
```

### 工具函数

#### computedAccept

计算接受的文件类型。

```typescript
computedAccept(accept:string | string[]):string
```

#### typeFormatComponent

根据文件名获取对应的预览组件。

```typescript
typeFormatComponent(filename:string):React.ComponentType
```

