const { PrintButton } = _ReactFile;
const { useRef } = React;
const { Flex, Typography } = antd;

const { Title, Paragraph } = Typography;

const BaseExample = () => {
  const contentRef = useRef(null);

  return (
    <Flex vertical gap={16}>
      <div
        ref={contentRef}
        style={{
          padding: 24,
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          background: '#fff'
        }}
      >
        <Title level={4} style={{ marginTop: 0 }}>
          打印内容示例
        </Title>
        <Paragraph>
          这是一段将被打印的内容。点击下方「打印」按钮会打开浏览器打印对话框，仅打印该区域内容。
        </Paragraph>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          支持传入 onBeforePrint / onSuccess / onError 回调，以及 printProps 透传给 react-to-print。
        </Paragraph>
      </div>
      <PrintButton contentRef={contentRef} type="primary">
        打印
      </PrintButton>
    </Flex>
  );
};

render(<BaseExample />);
