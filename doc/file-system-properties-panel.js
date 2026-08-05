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
