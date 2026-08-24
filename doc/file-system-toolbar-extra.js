const { FileSystem, FileUpload } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Button, message, Space } = antd;
const { DeleteOutlined, ReloadOutlined, FolderAddOutlined } = icons;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const items = [
    { kind: 'folder', path: 'documents/', name: 'Documents' },
    { kind: 'file', path: 'documents/Q3-report.pdf', name: 'Q3-report.pdf', size: 1024000 },
    { kind: 'file', path: 'documents/notes.md', name: 'notes.md', size: 3200 },
    { kind: 'file', path: 'readme.txt', name: 'readme.txt', size: 1200 }
  ];

  return (
    <PureGlobal
      preset={{
        ajax: async api => ({ data: { code: 0, data: api.loader?.() } }),
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
            upload: async ({ file, path }) => {
              // path 为当前文件夹（进入目录或分栏展开后的 uploadPath）
              console.log('upload to', path || '(root)', file?.name);
              return {
                data: {
                  code: 0,
                  data: { id: `mock-${Date.now()}`, filename: file.name, path: path || '' }
                }
              };
            }
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
            toolbarExtra={({ uploadPath, selectedEntries, clearSelection }) => (
              <Space size={8}>
                {/* 在 FileSystem 内未传 directory 时，FileUpload 会自动使用当前 uploadPath */}
                <FileUpload showUploadList={false} size="small">
                  上传
                </FileUpload>
                <Button size="small" icon={<FolderAddOutlined />} onClick={() => message.info(`新建文件夹于 ${uploadPath || '/'}`)}>
                  新建文件夹
                </Button>
                <Button size="small" icon={<ReloadOutlined />} onClick={() => message.success('已刷新')}>
                  刷新
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedEntries.length}
                  onClick={() => {
                    message.info(`已选择 ${selectedEntries.length} 项`);
                    clearSelection();
                  }}
                >
                  删除选中
                </Button>
              </Space>
            )}
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
