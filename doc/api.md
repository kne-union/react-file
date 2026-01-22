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

### MarkdownPreview

Markdown文件预览组件，支持渲染Markdown格式的文档。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|-------|------|
| url | string | - | Markdown文件的URL地址 |
| className | string | - | 自定义容器类名 |
| maxWidth | string/number | - | 容器最大宽度 |

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
