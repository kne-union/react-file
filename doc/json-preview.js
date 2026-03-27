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
          />
        </InfoPage.Part>
        <InfoPage.Part title="JSON文件预览 - 白色主题">
          <JsonPreview 
            url="https://jsonplaceholder.typicode.com/users"
            theme="light"
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
