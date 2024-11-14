const { Download } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Flex } = antd;

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
    <Flex gap={8}>
      <Download id="123">下载文件</Download>
      <Download id="123" filename="图片">下载文件并设置名称</Download>
      <Download src="/logo192.png" filename="图片">直接通过src链接下载</Download>
    </Flex>
  </PureGlobal>;
});

render(<BaseExample />);
