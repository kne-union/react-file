
# react-file


### 描述

提供了文件上传，文件预览，文件批量管理等功能


### 安装

```shell
npm i --save @kne/react-file
```

### 示例(全屏)

#### 示例代码

- File
- 从oss获取文件地址
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),remoteLoader(@kne/remote-loader)

```jsx
const { default: File } = _ReactFile;
const { createWithRemoteLoader } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
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
const { createWithRemoteLoader } = remoteLoader;
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
        <Image.Avatar gender="F" size={30}/>
        <Image.Avatar gender="M" size={50}/>
        <Image.Avatar size={80}/>
        <Image.Avatar gender="F" id="xxxxxx" size={100}/>
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
const { createWithRemoteLoader } = remoteLoader;
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
const { createWithRemoteLoader } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/demo.jpg',
              2: '/mock/demo2.pdf',
              3: '/mock/demo2.html',
              4: '/mock/demo.txt',
              5: '/mock/audio.wav',
              6: '/mock/office.docx'
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
    <FileButton id="1" filename="demo.jpg" modalProps={{ width: 800 }}>预览demo.jpg</FileButton>
    <FileButton id="2" filename="demo2.pdf" modalProps={{ width: 800 }}>预览demo2.pdf</FileButton>
    <FileButton id="3" filename="demo2.html" modalProps={{ width: 800 }}>预览demo2.html</FileButton>
  </PureGlobal>;
});

render(<BaseExample />);

```

- FileList
- 文件列表
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileList } = _ReactFile;
const { createWithRemoteLoader } = remoteLoader;
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
        getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/demo.jpg',
              2: '/mock/demo2.pdf',
              3: '/mock/demo2.html',
              4: '/mock/demo.txt',
              5: '/mock/audio.wav',
              6: '/mock/office.docx'
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
      uuid: "121233",
      type: "uploading",
      filename: "张三的简历.doc",
    },
      {
        id: "2",
        filename: "我是一份简历.pdf",
        date: "2022-07-15T11:09:15.000+08:00",
        userName: "用户名",
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
const { createWithRemoteLoader } = remoteLoader;

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
const { createWithRemoteLoader } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        getUrl: {
          loader: async ({ params }) => {
            const urlMap = {
              1: '/mock/demo.jpg',
              2: '/mock/demo2.pdf',
              3: '/mock/demo2.html',
              4: '/mock/demo.txt',
              5: '/mock/audio.wav',
              6: '/mock/office.docx'
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

| 属性名 | 说明 | 类型 | 默认值 |
|-----|----|----|-----|
|     |    |    |     |

