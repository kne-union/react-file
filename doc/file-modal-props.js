const { getFileModalProps } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Button, Flex } = antd;

const urlMap = {
  1: '/mock/resume.png',
  2: '/mock/resume.pdf'
};

const Buttons = createWithRemoteLoader({
  modules: ['components-core:Modal@useModal']
})(({ remoteModules }) => {
  const [useModal] = remoteModules;
  const modal = useModal();
  return (
    <Flex wrap gap={8}>
      <Button onClick={() => modal(getFileModalProps({ id: '1', filename: 'demo.png', openPrint: true }))}>命令式预览图片</Button>
      <Button onClick={() => modal(getFileModalProps({ id: '2', filename: 'demo.pdf' }))}>命令式预览 PDF</Button>
    </Flex>
  );
});

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        },
        apis: {
          file: {
            staticUrl: getPublicPath('react-file') || window.PUBLIC_URL,
            getUrl: {
              loader: async ({ params }) => urlMap[params.id]
            }
          }
        }
      }}
    >
      <Buttons />
    </PureGlobal>
  );
});

render(<BaseExample />);
