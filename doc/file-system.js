const { FileSystem } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Segmented } = antd;
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
    { kind: 'folder', path: 'images/', name: 'Images' },
    { kind: 'file', path: 'images/logo.png', name: 'logo.png', size: 45000 },
    { kind: 'file', path: 'images/banner.jpg', name: 'banner.jpg', size: 89000 },
    { kind: 'folder', path: 'archives/', name: 'Archives' },
    { kind: 'file', path: 'archives/project-backup.zip', name: 'project-backup.zip', size: 15728640 },
    { kind: 'file', path: 'readme.md', name: 'readme.md', size: 3200 },
    { kind: 'file', path: 'config.json', name: 'config.json', size: 1200 }
  ]);

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
        <InfoPage.Part title="文件系统浏览">
          <FileSystem
            items={items}
            title="My Files"
            defaultView="list"
            onFileOpen={entry => {
              console.log('Open file:', entry);
            }}
            onSelectionChange={entry => {
              console.log('Selection changed:', entry);
            }}
          />
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);
