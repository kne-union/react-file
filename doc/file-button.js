const { FileButton } = _ReactFile;
const { createWithRemoteLoader, getPublicPath } = remoteLoader;
const { Flex, Typography } = antd;

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
              1: '/mock/resume.png',
              2: '/mock/resume.pdf',
              3: '/mock/resume.html',
              4: '/mock/resume.txt',
              5: '/mock/audio.wav',
              6: '/mock/resume.docx',
              9: '/mock/small-image.png',
              10: '/mock/video.mp4'
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
    <Flex vertical gap={16}>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">图片</Typography.Text>
        <Flex wrap gap={8}>
          <FileButton id="1" filename="demo.jpg" openPrint modalProps={{ width: 800 }}>demo.jpg</FileButton>
          <FileButton id="9" filename="small-image.png" openPrint modalProps={{ width: 800 }}>小尺寸图片</FileButton>
        </Flex>
      </Flex>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">文档</Typography.Text>
        <Flex wrap gap={8}>
          <FileButton id="2" filename="demo2.pdf" openPrint modalProps={{ width: 800 }}>demo2.pdf</FileButton>
          <FileButton id="3" filename="demo2.html" openPrint modalProps={{ width: 800 }}>demo2.html</FileButton>
          <FileButton id="6" filename="resume.docx" openPrint modalProps={{ width: 800 }}>resume.docx</FileButton>
        </Flex>
      </Flex>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">音视频</Typography.Text>
        <Flex wrap gap={8}>
          <FileButton id="10" filename="video.mp4" modalProps={{ width: 800 }}>video.mp4</FileButton>
          <FileButton id="5" filename="audio.wav" modalProps={{ width: 800 }}>audio.wav</FileButton>
        </Flex>
      </Flex>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">链接样式</Typography.Text>
        <Flex wrap gap={8}>
          <FileButton id="6" filename="resume.docx" openPrint modalProps={{ width: 800 }} type="link">resume.docx</FileButton>
        </Flex>
      </Flex>
    </Flex>
  </PureGlobal>;
});

render(<BaseExample />);
