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
