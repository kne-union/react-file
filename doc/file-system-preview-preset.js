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
