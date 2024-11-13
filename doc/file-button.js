const { FileButton } = _ReactFile;
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
            const urlMap = {
              1: '/mock/demo.jpg',
              2: '/mock/demo2.pdf',
              3: '/mock/demo2.html',
              4: '/mock/demo.txt',
              5: '/mock/audio.wav',
              6: '/mock/office.docx'
            };
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(urlMap[params.id]);
              }, 1000);
            });
          }
        }
      }
    }
  }}>
    <FileButton id="1" filename="demo.jpg" modalProps={{ width: 800 }}>预览demo.jpg</FileButton>
    <FileButton id="2" filename="demo2.pdf" modalProps={{ width: 800 }}>预览demo2.pdf</FileButton>
    <FileButton id="3" filename="demo2.html" modalProps={{ width: 800 }}>预览demo2.html</FileButton>
  </PureGlobal>;
});

render(<BaseExample />);
