const { MarkdownPreview } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:InfoPage']
})(({ remoteModules }) => {
  const [InfoPage] = remoteModules;
  return (
    <InfoPage>
      <InfoPage.Part title="基础用法">
        <MarkdownPreview url="/mock/example.md" />
      </InfoPage.Part>
    </InfoPage>
  );
});

render(<BaseExample />);
