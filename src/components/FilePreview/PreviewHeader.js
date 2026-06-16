import { Flex, Space } from 'antd';
import style from './style.module.scss';

const PreviewHeader = ({ filename, extra, actions = [] }) => {
  return (
    <Flex className={style['office-toolbar']} justify="space-between" align="center" wrap="wrap" gap={8}>
      <Flex align="center" gap={12} wrap="wrap" className={style['office-toolbar-left']}>
        <span className={style['office-file-name']}>{filename}</span>
        {extra}
      </Flex>
      {actions.length > 0 ? (
        <Space wrap size={8} align="center" className={style['office-toolbar-actions']}>
          {actions}
        </Space>
      ) : null}
    </Flex>
  );
};

export default PreviewHeader;
