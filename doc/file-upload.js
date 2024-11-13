const { FileUpload } = _ReactFile;
const { createWithRemoteLoader } = remoteLoader;

const urls = {};

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
                resolve(urls[params.id]);
              }, 1000);
            });
          }
        }, upload: ({ file }) => {
          urls[file.name] = URL.createObjectURL(file);
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  code: 0, data: {
                    id: file.name, filename: file.name
                  }
                }
              });
            }, 1000);
          });
        }
      }
    }
  }}>
    <FileUpload />
  </PureGlobal>;
});

render(<BaseExample />);
