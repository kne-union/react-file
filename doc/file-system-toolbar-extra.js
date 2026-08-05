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
                  onClick={() => message.info(`已选择 ${selectedEntries.length} 项`)}
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
