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
| onUpload | function({ file, path? }) | - | 自定义上传函数；优先于 `ossUpload` / preset `apis.file.upload` |
| ossUpload | function | - | 自定义上传函数（兼容旧写法，等价于 `onUpload`） |
| directory | string | - | 上传目录；内部映射为后端 `path` 传给上传接口 |
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
| entries | array | - | 异步分页：当前目录稀疏数组（`length === totalCount`，未加载为 empty） |
| totalCount | number | - | 异步分页：当前目录总数量；与 `onVisibleRangeChange` 同时传入即开启虚拟滚动 |
| loadingIndexes | Set \| array | - | 异步分页：正在加载的下标，显示骨架占位 |
| ready | boolean | - | 异步分页：当前目录是否已确认首屏数据；`false` 时即使 `totalCount === 0` 仍挂载虚拟列表以测量视口；未传时保持旧逻辑 |
| columnListings | object | - | 异步分页（分栏）：按目录 path 隔离的列表数据，形如 `{ [path]: { entries, totalCount, loadingIndexes?, ready? } }`；展开列从这里读，避免只靠当前目录 `entries` |
| onRegisterFolder | function(path, id) | - | 分栏单击文件夹展开下一列时回调；用于业务侧登记 folderId 与 path 的映射 |
| onVisibleRangeChange | function(range) | - | 异步分页：可视范围变化。`range` 含：`startIndex` / `endIndex` / `view` / `viewport` / `pageSize` / `currentPath` / `keyword` / `path` / `columnPath`。分栏展开列以 `columnPath`（或合并后的 `path`）为准拉目录；其它视图 `path` 等于 `currentPath` |

`calcPageSize({ view, width, height, buffer? })` 可按视口估算建议 `perPage`（也可写作 `FileSystem.calcPageSize`）。`view` 为 `icons` / `list` / `columns` / `gallery`；`buffer` 默认 `2`，结果夹在 20–200。

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

### uploadFile

统一上传入口。库内上传应走此 API；会解析自定义 `onUpload` 或 preset `apis.file.upload` / `ossUpload` / `upload`，并将 `directory` 映射为后端 `path`。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| file | File | - | 待上传文件 |
| directory | string | - | 上传目录，映射为请求体 `path` |
| onUpload | function({ file, path? }) | - | 自定义上传函数；不传则读 `apis` |
| apis | object | - | API 配置；默认取自 preset |

#### 返回值

上传接口的原始返回值（通常为 `{ data: { code, data, msg } }` 形态，由业务 `apis.file.upload` 决定）。

```jsx
import { uploadFile } from '@kne/react-file';

await uploadFile({ file, directory: 'docs/2026' });
```

---

### useUploadFile

返回绑定当前 preset `apis` 的 `uploadFile` 函数，便于在组件内直接调用。

#### 返回值

| 类型 | 描述 |
|------|------|
| function(params) | 同 `uploadFile`；可再传 `apis` 覆盖 preset |

```jsx
import { useUploadFile } from '@kne/react-file';

const upload = useUploadFile();
await upload({ file, directory: 'avatars' });
```

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
| onUpload | function({ file, path? }) | - | 自定义上传函数 |
| directory | string | - | 上传目录；内部映射为后端 `path` |

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
