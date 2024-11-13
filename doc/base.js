const { default: File } = _ReactFile;
const { createWithRemoteLoader } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        getUrl: {
          loader: async ({ params }) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('/logo192.png');
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <File id="123">{({ url }) => {
      return url;
    }}</File>
  </PureGlobal>;
});

render(<BaseExample />);
