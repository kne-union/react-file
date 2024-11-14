const { FilePreview } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL, getUrl: {
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
    <InfoPage>
      <InfoPage.Part title="预览图片">
        <FilePreview id="1" />
      </InfoPage.Part>
      <InfoPage.Part title="预览PDF">
        <FilePreview id="2" />
      </InfoPage.Part>
      <InfoPage.Part title="预览HTML">
        <FilePreview id="3" />
      </InfoPage.Part>
      <InfoPage.Part title="预览TXT">
        <FilePreview id="4" />
      </InfoPage.Part>
      <InfoPage.Part title="预览AUDIO">
        <FilePreview id="5" />
      </InfoPage.Part>
      <InfoPage.Part title="预览OFFICE">
        <FilePreview id="6" />
      </InfoPage.Part>
    </InfoPage>

  </PureGlobal>;
});

render(<BaseExample />);
