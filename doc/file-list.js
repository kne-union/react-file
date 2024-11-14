const { FileList } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Divider } = antd;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return <PureGlobal preset={{
    ajax: async api => {
      return { data: { code: 0, data: api.loader() } };
    }, apis: {
      file: {
        staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
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
    <FileList dataSource={[{
      uuid: '121233',
      type: 'uploading',
      filename: '张三的简历.doc'
    },
      {
        id: '2',
        filename: '我是一份简历.pdf',
        date: '2022-07-15T11:09:15.000+08:00',
        userName: '用户名'
      }]} />
    <Divider />
    <FileList dataSource={[]} />
  </PureGlobal>;
});

render(<BaseExample />);
