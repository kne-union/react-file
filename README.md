# react-file

### 描述

React文件操作组件库，提供文件上传、多格式预览、下载、列表管理及文件系统浏览，支持i18n

### 安装

```shell
npm i --save @kne/react-file
```

### 概述

React文件操作组件库，提供文件上传、多格式预览、下载、列表管理及文件系统浏览的完整解决方案，支持国际化。

### 主要特性

- **文件上传** - 支持单文件/多文件上传，可自定义文件类型、大小限制和并发数
- **文件预览** - 根据文件类型自动选择预览方式，支持图片、音频、视频、PDF、Office文档、HTML、Markdown、JSON、ZIP、文本等
- **文件下载** - 支持OSS文件ID下载、直接URL下载和Blob数据下载
- **文件列表** - 展示已上传文件列表，支持上传中状态、预览、下载、删除操作
- **文件系统** - 提供文件系统浏览组件，支持图标、列表、分栏、画廊四种视图模式
- **图片处理** - 支持默认头像、性别区分头像、加载骨架屏和失败占位图
- **打印功能** - 内置打印按钮组件，支持打印前/后回调
- **国际化** - 内置中英文语言包，支持多语言切换

### 组件概览

#### File
文件组件，通过OSS文件ID获取文件URL，使用render props模式。

#### FileUpload
文件上传组件，支持单文件和多文件上传，可自定义接受的文件类型和上传限制。

#### FilePreview
文件预览组件，根据文件类型自动选择合适的预览方式。支持本地URL和OSS文件ID两种方式。

#### FileList
文件列表组件，用于展示和管理已上传的文件，支持上传中状态、预览、下载和删除操作。

#### FileButton
文件操作按钮组件，点击后弹出文件预览弹窗，支持下载和打印。

#### Download
文件下载按钮组件，支持OSS文件ID下载和直接URL下载。

#### Image
图片组件，支持默认头像、性别区分的头像显示，以及加载失败时的占位图。

#### FileSystem
文件系统浏览组件，提供图标、列表、分栏、画廊四种视图，支持导航历史和搜索。

#### PrintButton
打印按钮组件，用于触发浏览器打印功能。


### 示例

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

- PrintButton
- 打印按钮
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd)

```jsx
const { PrintButton } = _ReactFile;
const { useRef } = React;
const { Flex, Typography } = antd;

const { Title, Paragraph } = Typography;

const BaseExample = () => {
  const contentRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <div
        ref={contentRef}
        style={{
          padding: 24,
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          background: '#fff'
        }}
      >
        <Title level={4} style={{ marginTop: 0 }}>
          打印内容示例
        </Title>
        <Paragraph>
          这是一段将被打印的内容。点击下方「打印」按钮会打开浏览器打印对话框，仅打印该区域内容。
        </Paragraph>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          支持传入 onBeforePrint / onSuccess / onError 回调，以及 printProps 透传给 react-to-print。
        </Paragraph>
      </div>
      <PrintButton contentRef={contentRef} type="primary">
        打印
      </PrintButton>
    </Flex>
  );
};

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
  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        },
        apis: {
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
                  6: '/mock/resume.docx',
                  7: '/mock/example.zip',
                  8: '/mock/resume.xlsx'
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
          <FilePreview id="6" filename="resume.docx" />
          <FilePreview id="8" filename="resume.xlsx" />
        </InfoPage.Part>
        <InfoPage.Part title="预览ZIP">
          <FilePreview id="7" />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- MarkdownPreview
- Markdown文件预览
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),remoteLoader(@kne/remote-loader)

```jsx
const { MarkdownPreview } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:InfoPage']
})(({ remoteModules }) => {
  const [InfoPage] = remoteModules;
  return (
    <InfoPage>
      <InfoPage.Part title="基础用法">
        <MarkdownPreview url={&#96;${getPublicPath('react-file')}/mock/example.md&#96;} />
      </InfoPage.Part>
    </InfoPage>
  );
});

render(<BaseExample />);

```

- JsonPreview
- JSON文件预览
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),remoteLoader(@kne/remote-loader)

```jsx
const { JsonPreview } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  return (
    <PureGlobal preset={{
      ajax: async api => {
        return { data: { code: 0, data: api.loader() } };
      },
      apis: {
        file: {
          staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
        }
      }
    }}>
      <InfoPage>
        <InfoPage.Part title="JSON文件预览 - 默认黑色主题">
          <JsonPreview 
            url="https://jsonplaceholder.typicode.com/users"
            collapsedFrom={0}
          />
        </InfoPage.Part>
        <InfoPage.Part title="JSON文件预览 - 白色主题">
          <JsonPreview 
            url="https://jsonplaceholder.typicode.com/users"
            theme="light"
            collapsedFrom={0}
          />
        </InfoPage.Part>
        <InfoPage.Part title="JSON文件预览 - 从第2级开始收起">
          <JsonPreview 
            url="https://jsonplaceholder.typicode.com/users"
            collapsedFrom={2}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- FileSystem
- 文件系统浏览；选中后右侧属性面板（可关闭），也可传 function 自定义内容
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileSystem } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { useState } = React;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const [items] = useState([
    { kind: 'folder', path: 'documents/', name: 'Documents' },
    { kind: 'folder', path: 'documents/reports/', name: 'Reports' },
    { kind: 'file', path: 'documents/reports/Q3-report.pdf', name: 'Q3-report.pdf', size: 1024000 },
    { kind: 'file', path: 'documents/reports/Q4-report.xlsx', name: 'Q4-report.xlsx', size: 512000 },
    { kind: 'file', path: 'documents/meeting-notes.docx', name: 'meeting-notes.docx', size: 256000 },
    {
      kind: 'file',
      path: 'documents/超长文件名-2024年度第一季度产品规划评审会会议纪要与行动项跟踪清单-最终版-v3.2.1-已确认.pdf',
      name: '超长文件名-2024年度第一季度产品规划评审会会议纪要与行动项跟踪清单-最终版-v3.2.1-已确认.pdf',
      size: 1048576
    },
    {
      kind: 'folder',
      path: '超长文件夹名称-客户交付资料归档-华东区-2024Q1-Q2合并备份/',
      name: '超长文件夹名称-客户交付资料归档-华东区-2024Q1-Q2合并备份'
    },
    {
      kind: 'file',
      path: 'very-very-long-english-filename-without-spaces-product-requirements-document-final-review-copy-v12.docx',
      name: 'very-very-long-english-filename-without-spaces-product-requirements-document-final-review-copy-v12.docx',
      size: 256000
    },
    { kind: 'folder', path: 'images/', name: 'Images' },
    { kind: 'file', path: 'images/logo.png', name: 'logo.png', size: 45000 },
    { kind: 'file', path: 'images/banner.jpg', name: 'banner.jpg', size: 89000 },
    { kind: 'folder', path: 'archives/', name: 'Archives' },
    { kind: 'file', path: 'archives/project-backup.zip', name: 'project-backup.zip', size: 15728640 },
    { kind: 'file', path: 'readme.md', name: 'readme.md', size: 3200 },
    { kind: 'file', path: 'config.json', name: 'config.json', size: 1200 }
  ]);

  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        },
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
          }
        }
      }}
    >
      <InfoPage>
        <InfoPage.Part title="文件系统浏览（含属性面板）">
          <FileSystem
            items={items}
            title="My Files"
            defaultView="icons"
            onFileOpen={entry => {
              console.log('Open file:', entry);
            }}
            onSelectionChange={entries => {
              console.log('Selection changed:', entries);
            }}
            propertiesPanel={({ selectedEntries, index }) => (
              <FileSystem.PropertiesPanel.Default
                selectedEntries={selectedEntries}
                index={index}
                extraInfo={({ entry }) =>
                  entry ? <FileSystem.PropertiesPanel.InfoRow label="扩展字段" value={entry.id || entry.path} /> : null
                }
              />
            )}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- FileSystem 扩展顶部菜单
- 通过 toolbarExtra 在导航栏追加上传、新建文件夹、刷新、删除选中等自定义操作
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),icons(@ant-design/icons),remoteLoader(@kne/remote-loader)

```jsx
const { FileSystem } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Button, message, Space } = antd;
const { DeleteOutlined, ReloadOutlined, UploadOutlined, FolderAddOutlined } = icons;
const { useState } = React;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [items] = useState([
    { kind: 'folder', path: 'documents/', name: 'Documents' },
    { kind: 'file', path: 'documents/Q3-report.pdf', name: 'Q3-report.pdf', size: 1024000 },
    { kind: 'file', path: 'documents/notes.md', name: 'notes.md', size: 3200 },
    { kind: 'file', path: 'readme.txt', name: 'readme.txt', size: 1200 }
  ]);

  return (
    <PureGlobal
      preset={{
        ajax: async api => ({ data: { code: 0, data: api.loader?.() } }),
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
          }
        }
      }}
    >
      <InfoPage>
        <InfoPage.Part title="扩展顶部菜单（toolbarExtra）">
          <FileSystem
            items={items}
            title="My Files"
            defaultView="list"
            toolbarExtra={
              <Space size={8}>
                <Button size="small" icon={<UploadOutlined />} onClick={() => message.info('自定义上传')}>
                  上传
                </Button>
                <Button size="small" icon={<FolderAddOutlined />} onClick={() => message.info('自定义新建文件夹')}>
                  新建文件夹
                </Button>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => message.success('已刷新')}
                >
                  刷新
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedEntries.length}
                  onClick={() => message.info(&#96;已选择 ${selectedEntries.length} 项&#96;)}
                >
                  删除选中
                </Button>
              </Space>
            }
            onSelectionChange={entries => {
              setSelectedEntries(entries || []);
            }}
            onFileOpen={entry => {
              console.log('Open file:', entry);
            }}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- FileSystem 扩展预览类型
- 通过 preset({ previewExtensions, previewMapping }) 扩展 .log / .dwg 等预览类型（对齐 table-view）
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),remoteLoader(@kne/remote-loader)

```jsx
const { FileSystem, FilePreview, preset } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { useState } = React;

const CadPreview = ({ filename, url }) => {
  return (
    <div style={{ padding: 24, background: '#fafafa', height: '100%' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>自定义 CAD 预览</div>
      <div>文件名：{filename || '-'}</div>
      <div style={{ color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>地址：{url || '-'}</div>
    </div>
  );
};

// 对齐 @kne/table-view：通过 preset 扩展预览类型
preset({
  previewExtensions: {
    log: 'txt',
    dwg: 'cad'
  },
  previewMapping: {
    cad: CadPreview
  }
});

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const [items] = useState([
    { kind: 'folder', path: 'docs/', name: 'docs' },
    { kind: 'file', path: 'docs/readme.txt', name: 'readme.txt', size: 128 },
    { kind: 'file', path: 'docs/app.log', name: 'app.log', size: 256 },
    { kind: 'file', path: 'docs/plan.dwg', name: 'plan.dwg', size: 1024 },
    { kind: 'file', path: 'docs/report.pdf', name: 'report.pdf', size: 2048 }
  ]);

  return (
    <PureGlobal
      preset={{
        ajax: async api => ({ data: { code: 0, data: api.loader?.() } }),
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
          }
        }
      }}
    >
      <InfoPage>
        <InfoPage.Part title="扩展预览类型（preset）">
          <FileSystem
            items={items}
            title="Preview Ext"
            defaultView="gallery"
            canPreviewFile={entry => /\.(log|dwg|txt|pdf)$/i.test(entry.name || '')}
            renderFilePreview={entry => <FilePreview src={entry.path} filename={entry.name} originName={entry.name} />}
            onFileOpen={entry => {
              console.log('Open file:', entry);
            }}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- FileSystem 状态徽标
- 文件/文件夹右上角状态徽标：sync / processing / success / error / cancelled，以及自定义 JSX；支持 entry.status、options.status、getEntryStatus
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),icons(@ant-design/icons),remoteLoader(@kne/remote-loader)

```jsx
const { FileSystem, EntryIcon } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Space, Tag } = antd;
const { StarFilled } = icons;
const { useState } = React;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const [items] = useState([
    { kind: 'folder', path: 'syncing/', name: '同步中的文件夹', status: 'sync' },
    { kind: 'folder', path: 'done/', name: '已完成文件夹', status: 'success' },
    { kind: 'file', path: 'report-processing.pdf', name: 'report-processing.pdf', size: 1024000, status: 'processing' },
    { kind: 'file', path: 'report-error.xlsx', name: 'report-error.xlsx', size: 512000, status: 'error' },
    { kind: 'file', path: 'notes-done.md', name: 'notes-done.md', size: 3200, status: 'complete' },
    { kind: 'file', path: 'draft-cancelled.docx', name: 'draft-cancelled.docx', size: 256000, status: 'cancelled' },
    { kind: 'file', path: 'logo.png', name: 'logo.png', size: 45000, status: '同步' },
    { kind: 'file', path: 'readme.md', name: 'readme.md', size: 1200, options: { status: '进行中' } },
    { kind: 'file', path: 'custom-star.txt', name: 'custom-star.txt', size: 800, status: 'custom' }
  ]);

  return (
    <PureGlobal
      preset={{
        ajax: async api => ({ data: { code: 0, data: api.loader?.() } }),
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
          }
        }
      }}
    >
      <InfoPage>
        <InfoPage.Part title="内置状态徽标（entry.status / options.status）">
          <Space wrap size={16} style={{ marginBottom: 16 }}>
            {[
              ['sync', '同步'],
              ['processing', '进行中'],
              ['success', '完成'],
              ['error', '错误'],
              ['cancelled', '已取消']
            ].map(([status, label]) => (
              <Space key={status} direction="vertical" align="center" size={4}>
                <EntryIcon entry={{ kind: 'file', name: 'demo.pdf' }} size="lg" status={status} />
                <Tag>{label}</Tag>
              </Space>
            ))}
            <Space direction="vertical" align="center" size={4}>
              <EntryIcon
                entry={{ kind: 'folder', name: 'folder' }}
                size="lg"
                status={<StarFilled style={{ color: '#faad14', fontSize: 7.2 }} />}
              />
              <Tag>自定义 JSX</Tag>
            </Space>
          </Space>
        </InfoPage.Part>
        <InfoPage.Part title="文件系统中的徽标展示">
          <FileSystem
            items={items}
            title="Status Badges"
            defaultView="icons"
            getEntryStatus={entry => {
              if (entry.status === 'custom') {
                return <StarFilled style={{ color: '#faad14', fontSize: 7.2 }} />;
              }
              return entry.status ?? entry.options?.status;
            }}
            onFileOpen={entry => {
              console.log('Open file:', entry);
            }}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- FileSystem.PropertiesPanel
- 使用 FileSystem.PropertiesPanel.Default / InfoRow / Section 扩展属性面板显示字段
- _ReactFile(@kne/current-lib_react-file)[import * as _ReactFile from "@kne/react-file"],(@kne/current-lib_react-file/dist/index.css),antd(antd),remoteLoader(@kne/remote-loader)

```jsx
const { FileSystem } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const { PropertiesPanel } = FileSystem;
  const items = [
    { kind: 'folder', path: 'documents/', name: 'Documents', createdAt: '2024-10-09T11:44:00' },
    { kind: 'folder', path: 'documents/reports/', name: 'Reports' },
    { kind: 'file', path: 'documents/reports/Q3-report.pdf', name: 'Q3-report.pdf', size: 1024000, author: 'Alice' },
    { kind: 'file', path: 'documents/meeting-notes.docx', name: 'meeting-notes.docx', size: 256000, author: 'Bob' },
    {
      kind: 'file',
      path: '超长文件名-2024年度第一季度产品规划评审会会议纪要与行动项跟踪清单-最终版-v3.2.1-已确认.pdf',
      name: '超长文件名-2024年度第一季度产品规划评审会会议纪要与行动项跟踪清单-最终版-v3.2.1-已确认.pdf',
      size: 1048576,
      author: 'Alice'
    },
    {
      kind: 'folder',
      path: '超长文件夹名称-客户交付资料归档-华东区-2024Q1-Q2合并备份/',
      name: '超长文件夹名称-客户交付资料归档-华东区-2024Q1-Q2合并备份'
    },
    {
      kind: 'file',
      path: 'very-very-long-english-filename-without-spaces-product-requirements-document-final-review-copy-v12.docx',
      name: 'very-very-long-english-filename-without-spaces-product-requirements-document-final-review-copy-v12.docx',
      size: 256000,
      author: 'Bob'
    },
    { kind: 'file', path: 'readme.md', name: 'readme.md', size: 3200, author: 'Alice' },
    { kind: 'file', path: 'config.json', name: 'config.json', size: 1200 }
  ];

  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        },
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL
          }
        }
      }}
    >
      <InfoPage>
        <InfoPage.Part title="默认 PropertiesPanel">
          <FileSystem items={items} title="My Files" defaultView="icons" propertiesPanel />
        </InfoPage.Part>
        <InfoPage.Part title="扩展 PropertiesPanel.Default / InfoRow / Section">
          <FileSystem
            items={items}
            title="My Files"
            defaultView="icons"
            propertiesPanel={({ selectedEntries, index }) => (
              <PropertiesPanel.Default
                selectedEntries={selectedEntries}
                index={index}
                extraInfo={({ entry }) =>
                  entry?.kind === 'file' ? <PropertiesPanel.InfoRow label="作者" value={entry.author} /> : null
                }
                extraSections={({ entry }) =>
                  entry ? (
                    <PropertiesPanel.Section title="更多">
                      <PropertiesPanel.InfoRow label="路径" value={entry.path} />
                    </PropertiesPanel.Section>
                  ) : null
                }
              />
            )}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

### API

### File

文件组件，通过OSS文件ID获取文件URL，使用render props模式。内部使用`withOSSFile` HOC获取文件URL。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID，必填 |
| children | function({ url, ...props }) | - | render props函数，参数包含获取到的文件URL |
| apis | object | - | 自定义API配置，会与全局preset.apis合并 |
| loading | ReactNode | null | 加载中显示的内容 |
| error | ReactNode | - | 加载失败显示的内容 |
| ttl | number | 6000000 | 缓存过期时间（毫秒） |
| cacheName | string | 'file-cache' | 缓存名称 |

---

### FileUpload

文件上传组件，支持单文件和多文件上传。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| value | array | [] | 已上传文件列表（受控） |
| defaultValue | array | [] | 默认文件列表 |
| onChange | function(list) | - | 文件列表变化回调 |
| accept | string[] | ['.pdf','.jpg','.png','.jpeg','.doc','.docx','.xls','.xlsx','.html','.msg','.eml','.zip'] | 接受的文件类型 |
| multiple | boolean | true | 是否支持多文件上传 |
| fileSize | number | 100 | 单个文件最大尺寸（MB） |
| maxLength | number | 10 | 最大文件数量 |
| concurrentCount | number | 10 | 上传并发数 |
| size | string | - | 按钮尺寸，同antd Button的size |
| showUploadList | boolean | true | 是否显示已上传文件列表 |
| children | ReactNode | '文件上传' | 上传按钮文字 |
| renderTips | function(defaultTips, { fileSize, maxLength, accept }) | v => v | 自定义提示信息渲染 |
| onSave | function(data, file, uuid) | - | 上传成功后数据处理回调，返回值将作为新的文件对象 |
| ossUpload | function | - | 自定义上传函数 |
| getPermission | function(type) | - | 文件列表操作权限控制函数，type为'preview'/'delete'等 |
| apis | object | - | API配置对象 |
| renderModal | function(modalProps) | props => Modal | 自定义弹窗渲染函数 |

---

### FileInput

文件输入组件，提供文件选择按钮。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| accept | string[] | defaultAccept | 接受的文件类型 |
| multiple | boolean | true | 是否支持多选 |
| buttonText | string | '文件上传' | 按钮文字 |
| onChange | function(fileList) | - | 文件选择后的回调，参数为File数组 |
| children | function({ children, ...props }) | - | 自定义按钮渲染函数 |
| disabled | boolean | false | 是否禁用 |

---

### FilePreview

文件预览组件，根据文件类型自动选择合适的预览方式。提供`src`时使用`TypePreview`，提供`id`时使用`OSSFilePreview`。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID |
| src | string | - | 文件URL |
| filename | string | - | 文件名，用于确定文件类型 |
| originName | string | - | 原始文件名，作为filename的备选 |
| apis | object | - | API配置对象 |

#### 预览子组件

以下子组件均可单独使用：

| 子组件 | 描述 |
|--------|------|
| ImagePreview | 图片预览 |
| AudioPreview | 音频预览 |
| VideoPreview | 视频预览 |
| PdfPreview | PDF预览 |
| DocxPreview | Word文档预览 |
| XlsxPreview | Excel预览 |
| OfficePreview | Office文档预览（根据文件类型选择DocxPreview或XlsxPreview） |
| HtmlPreview | HTML预览 |
| MarkdownPreview | Markdown预览 |
| JsonPreview | JSON预览 |
| ZipPreview | ZIP压缩包预览 |
| TextPreview | 文本文件预览 |
| UnknownPreview | 未知类型文件预览 |
| OSSFilePreview | OSS文件预览（通过ID获取URL后自动选择预览方式） |

---

### MarkdownPreview

Markdown文件预览组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| url | string | - | Markdown文件的URL地址 |
| className | string | - | 自定义容器类名 |
| maxWidth | string/number | - | 容器最大宽度 |

---

### JsonPreview

JSON文件预览组件，使用@kne/json-view提供友好的JSON数据展示。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| url | string | - | JSON文件的URL地址 |
| className | string | - | 自定义容器类名 |
| maxWidth | string/number | - | 容器最大宽度 |
| theme | 'light' \| 'dark' | 'dark' | 主题模式 |
| collapsedFrom | number | - | 从第几级开始收起，默认全部展开 |
| searchable | boolean | true | 是否开启搜索功能 |
| collapsable | boolean | true | 是否显示展开/收起全部按钮 |
| indentWidth | number | 20 | 缩进宽度（像素） |
| showLineNumbers | boolean | true | 是否显示行号 |

---

### ZipPreview

ZIP压缩包文件预览组件，支持查看压缩包内部的文件列表和目录结构。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| url | string | - | ZIP文件的URL地址 |
| className | string | - | 自定义容器类名 |
| maxWidth | string/number | - | 容器最大宽度 |

---

### FileList

文件列表组件，用于展示和管理文件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dataSource | array | [] | 文件列表数据，每项包含 id/filename/date/userName/type 等 |
| getPermission | function(type, item) | () => true | 操作权限控制函数，type为'preview'/'edit'/'download'/'delete' |
| infoItemRenders | array | [用户名, 日期] | 信息列渲染函数数组 |
| onDelete | function(item) | - | 删除文件的回调函数 |
| onEdit | function(item) | - | 编辑文件的回调函数 |
| apis | object | - | API配置对象 |
| renderModal | function(modalProps) | props => Modal | 自定义弹窗渲染函数 |

#### dataSource 数据项

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 文件ID |
| filename | string | 文件名 |
| src | string | 文件URL |
| date | string | 上传日期（ISO格式） |
| userName | string | 上传用户名 |
| type | string | 'uploading'表示上传中 |
| uuid | string | 上传中的临时标识 |

---

### FileListOptionButtons

文件列表操作按钮组件，提供预览、编辑、下载、删除操作。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| item | object | - | 文件数据项 |
| hasPreview | boolean | true | 是否显示预览按钮 |
| getPermission | function(type, item) | () => true | 操作权限控制函数 |
| apis | object | {} | API配置对象 |
| onDelete | function(item) | - | 删除回调 |
| onEdit | function(item) | - | 编辑回调 |
| onPreview | function(item) | - | 预览回调 |
| renderModal | function(modalProps) | props => Modal | 自定义弹窗渲染函数 |

---

### Download

文件下载按钮组件，基于antd Button封装。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID，通过API获取下载URL |
| src | string | - | 直接的下载URL |
| filename | string | '未命名下载文件' | 下载后的文件名 |
| api | object | - | 自定义API配置 |
| onSuccess | function | - | 下载成功的回调函数 |
| onError | function | - | 下载失败的回调函数 |
| onClick | function | - | 点击按钮的回调函数 |
| ...antd Button props | - | - | 支持所有antd Button属性 |

#### 静态方法

| 方法 | 描述 |
|------|------|
| Download.useDownload | useDownload Hook |
| Download.download | download(url, filename) 下载工具函数 |
| Download.downloadBlobFile | downloadBlobFile(input, filename, locale) Blob下载函数 |

---

### FileButton

文件操作按钮组件，点击后弹出文件预览弹窗。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID |
| src | string | - | 文件URL |
| filename | string | - | 文件名 |
| originName | string | - | 原始文件名，作为filename的备选 |
| title | string | - | 弹窗标题，默认使用filename |
| modalProps | object | - | 传递给弹窗的属性，如{ width: 800 } |
| openDownload | boolean | false | 弹窗中是否显示下载按钮 |
| openPrint | boolean | false | 弹窗中是否显示打印按钮（仅txt/pdf/image/html类型支持） |
| children | ReactNode \| function(filename) | - | 按钮内容，支持函数返回 |
| ...antd Button props | - | - | 支持所有antd Button属性（默认icon为LinkOutlined） |

---

### FileModal

文件预览弹窗组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID |
| src | string | - | 文件URL |
| filename | string | - | 文件名 |
| title | string | - | 弹窗标题 |
| open | boolean | - | 是否显示（受控） |
| defaultOpen | boolean | - | 默认是否显示 |
| onOpenChange | function(open) | - | 显示状态变化回调 |
| openDownload | boolean | false | 是否显示下载按钮 |
| openPrint | boolean | false | 是否显示打印按钮 |
| footer | ReactNode | null | 弹窗底部内容 |
| apis | object | - | API配置对象 |

---

### Image

图片组件，支持默认头像和加载失败处理。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID，通过ID获取图片URL |
| src | string | - | 图片源URL |
| alt | string | - | 图片替代文本 |
| loading | ReactNode | Skeleton.Avatar | 加载中显示的内容 |
| error | ReactNode | PhotoFail图标 | 加载失败显示的内容 |
| className | string | - | 自定义类名 |
| apis | object | - | API配置对象 |
| staticUrl | string | - | 静态资源URL前缀 |
| onClick | function | - | 点击事件 |
| children | function({ alt, className, src }) | - | 自定义渲染函数 |

#### Image.Avatar

头像子组件。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID |
| src | string | - | 图片源URL |
| gender | string | - | 性别，'F'/'female'显示女性头像，'M'/'male'显示男性头像 |
| shape | 'circle' \| 'square' | 'circle' | 头像形状 |
| size | number | 100 | 头像大小 |
| width | number | - | 自定义宽度（与height一起使用时shape自动变为square） |
| height | number | - | 自定义高度 |
| gap | number | - | 头像与边框的间距 |
| icon | ReactNode | - | 自定义图标 |
| defaultAvatar | ReactNode | AvatarDefault图标 | 默认头像SVG |
| loading | ReactNode | Skeleton.Avatar | 加载中显示的内容 |
| error | ReactNode | PhotoFail图标 | 加载失败显示的内容 |
| apis | object | - | API配置对象 |

---

### FileSystem

文件系统浏览组件，提供图标、列表、分栏、画廊四种视图模式。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| items | array | - | 文件系统条目数组 |
| title | string | 'Files' | 标题，当路径为根目录时显示 |
| defaultView | 'icons' \| 'list' \| 'columns' \| 'gallery' | 'list' | 默认视图模式 |
| defaultPath | string | '' | 默认路径 |
| className | string | - | 自定义类名 |
| toolbarExtra | ReactNode \| (ctx) => ReactNode | - | 工具栏扩展；函数时接收 `{ selectedEntries, clearSelection, currentPath }` |
| propertiesPanel | boolean \| ReactNode \| (ctx) => ReactNode | true | 右侧属性面板；`false` 关闭；函数时接收 `{ selectedEntries, index, currentPath, close, actions, onAction, defaultActions }` |
| propertiesActions | false \| ActionItem[] \| (ctx) => ActionItem[] \| object | 内置默认 | 属性面板操作；`false` 关闭；数组按 key 合并；函数完全自定义；`{ list, replace?, ...ButtonGroupProps }` 可替换或合并 |
| onPropertiesAction | (key, ctx) => void | - | 操作点击回调；`ctx` 含 `entry` / `selectedEntries` / `clearSelection` / `currentPath` |
| onSelectionChange | function(entries) | - | 选中项变化回调，参数为选中条目数组 |
| onPathChange | function(path) | - | 当前文件夹路径变化回调 |
| onFileOpen | function(entry) | - | 打开文件回调 |
| renderFilePreview | function(entry) | - | 画廊视图中的文件预览渲染函数 |
| canPreviewFile | function(entry) | - | 判断文件是否可预览的函数 |
| getEntryStatus | function(entry) => string \| ReactNode | - | 返回右上角状态徽标；优先于 `entry.status` / `entry.options.status` |

#### FileSystem.PropertiesPanel

| 成员 | 说明 |
|------|------|
| Default | 默认属性内容；支持 `extraInfo` / `extraSections`（节点或 `({ entry, selectedEntries, index }) => node`）追加信息行/区块；支持 `actions` / `onAction` |
| InfoRow | 信息行（`label` / `value`，value 为空不渲染） |
| Section | 信息区块（`title` / `children`） |
| Actions | 操作按钮组（接收 `actions` / `onAction`，语义同 `propertiesActions`） |
| getDefaultActions | 生成默认操作列表 |

可用 `FileSystem.PropertiesPanel.Default / InfoRow / Section / Actions` 扩展属性显示。

多选逻辑与 Windows / macOS 文件管理器一致：普通点击单选；Ctrl（Windows）/ Command（macOS）+ 点击切换选中；Shift + 点击按当前目录顺序区间选中；在空白处拖拽可框选（Ctrl/Command + 框选为追加）；点击空白取消选中。树形列表视图暂不支持框选。

#### items 数据项

| 字段 | 类型 | 描述 |
|------|------|------|
| kind | 'file' \| 'folder' | 条目类型 |
| path | string | 条目路径 |
| name | string | 显示名称（可选，默认从路径提取） |
| size | number | 文件大小（字节，仅file类型） |
| parentPath | string | 父路径（可选，默认从path提取） |
| status | string \| ReactNode | 右上角状态徽标；内置：`sync` / `processing` / `success`（`complete`） / `error` / `cancelled`，及中文别名；也可传自定义 JSX |
| options.status | string \| ReactNode | 同上，当 `status` 未设置时读取 |

#### EntryIcon

文件/文件夹图标组件，支持右上角状态徽标（圆形；相对 20px 规格缩至 60%：约 12px 外径、1.2px 白边与 padding、7.2px 图标）。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| entry | object | - | 含 `kind` / `name`（或 `path`）的条目 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | 图标尺寸 |
| status | string \| ReactNode | - | 徽标；不传时读 `entry.status` / `entry.options.status` |

---

### PrintButton

打印按钮组件，触发浏览器打印功能。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| contentRef | Ref | - | 需要打印内容的ref引用 |
| content | ReactNode | - | 打印内容（备用） |
| onBeforePrint | function | - | 打印前的回调函数 |
| onSuccess | function | - | 打印成功的回调函数 |
| onError | function | - | 打印失败的回调函数 |
| printProps | object | - | 传递给react-to-print的属性 |
| ...antd Button props | - | - | 支持所有antd Button属性 |

---

### withOSSFile

高阶组件，通过OSS文件ID获取文件URL并注入到被包裹组件。

#### 用法

```jsx
const MyComponent = withOSSFile(({ data, id, ...props }) => {
  // data 为获取到的文件URL
  return <div>{data}</div>;
});
```

#### 被注入的属性

| 属性 | 类型 | 描述 |
|------|------|------|
| data | string | 获取到的文件URL |
| fetchApi | object | react-fetch的API对象 |
| id | string | 格式化后的文件ID（去除了查询参数） |

---

### useFileUpload

文件上传Hook，处理文件上传逻辑。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| multiple | boolean | true | 是否支持多文件 |
| fileSize | number | 100 | 单个文件最大尺寸（MB） |
| maxLength | number | 10 | 最大文件数量 |
| value | array | [] | 已上传文件列表 |
| concurrentCount | number | 1 | 上传并发数 |
| onAdd | function(file) | - | 文件添加后回调（上传前） |
| onError | function({ file, error, errMsg }) | - | 上传失败回调 |
| onSave | function(data, file, uuid) | - | 上传成功后数据处理回调 |
| onChange | function(list) | - | 文件列表变化回调 |
| onUpload | function({ file }) | - | 自定义上传函数 |

#### 返回值

| 字段 | 类型 | 描述 |
|------|------|------|
| fileList | array | 正在上传中的文件列表 |
| onFileSelected | function(fileList) | 文件选择处理函数 |

---

### useDownload

文件下载Hook。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | - | OSS文件ID |
| src | string | - | 直接的下载URL |
| filename | string | - | 下载后的文件名 |
| staticUrl | string | - | 静态资源URL前缀 |
| apis | object | - | 自定义API配置 |
| onError | function(error) | - | 下载失败回调 |
| onSuccess | function | - | 下载成功回调 |

#### 返回值

| 字段 | 类型 | 描述 |
|------|------|------|
| isLoading | boolean | 是否正在下载 |
| download | function() | 触发下载 |
| ...react-fetch返回值 | - | 包含refresh等其他属性 |

---

### downloadBlobFile

Blob文件下载工具函数，支持URL字符串、Blob对象和远程URL下载。

#### 参数

```javascript
downloadBlobFile(input, filename, locale)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| input | string \| Blob | 下载源，支持blob URL、Blob对象或远程URL |
| filename | string | 下载后的文件名，默认'file' |
| locale | string | 国际化语言标识 |

---

### download

文件下载工具函数，通过创建a标签触发下载。

#### 参数

```javascript
download(url, filename)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| url | string | 下载URL |
| filename | string | 下载后的文件名 |

---

### computedAccept

计算接受的文件类型，将文件类型数组转为浏览器accept属性值。

#### 参数

```javascript
computedAccept(accept)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| accept | string \| string[] | 文件类型，如'.jpg,.png'或['.jpg', '.png'] |

#### 返回值

| 类型 | 描述 |
|------|------|
| string | 浏览器accept属性值 |

---

### typeFormat

根据文件扩展名获取文件类型标识。

#### 参数

```javascript
typeFormat(filename)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| filename | string | 文件名 |

#### 返回值

| 类型 | 描述 |
|------|------|
| string | 文件类型标识，如'image'/'pdf'/'docx'等 |

---

### preset / globalParams

全局参数预设（对齐 `@kne/table-view`），用于扩展或覆盖文件预览类型。

```jsx
import { preset, TextPreview } from '@kne/react-file';

preset({
  // 扩展名 -> 预览类型 key（内置识别不到时生效）
  previewExtensions: {
    log: 'txt',
    dwg: 'cad'
  },
  // 预览类型 key -> 预览组件（可新增或覆盖内置）
  previewMapping: {
    cad: CadPreview // 自定义组件，props 含 url / filename 等
  }
});
```

| 属性 | 类型 | 说明 |
|------|------|------|
| previewMapping | object | 合并到内置 `typeComponentMapping`，如 `{ pdf, image, cad: Comp }` |
| previewExtensions | object | 扩展名（不含点）到类型 key 的映射，如 `{ dwg: 'cad' }` |

也可通过 `components-core:File@preset` 在宿主初始化时调用。

---

### typeFormatComponent

根据文件名获取对应的预览组件。

#### 参数

```javascript
typeFormatComponent(filename)
```

| 参数 | 类型 | 描述 |
|------|------|------|
| filename | string | 文件名 |

#### 返回值

| 类型 | 描述 |
|------|------|
| React.ComponentType | 对应的预览组件 |
