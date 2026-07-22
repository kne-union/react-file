import { Space } from 'antd';
import style from './style.module.scss';

const PreviewHeader = ({ filename, extra, actions = [] }) => {
  const hasBar = Boolean(extra) || actions.length > 0;

  return (
    <div className={style['office-toolbar']}>
      <span className={style['office-file-name']} title={filename}>
        {filename}
      </span>
      {hasBar ? (
        <div className={style['office-toolbar-bar']}>
          <div className={style['office-toolbar-extra']}>{extra}</div>
          {actions.length > 0 ? (
            <Space wrap size={8} align="center" className={style['office-toolbar-actions']}>
              {actions}
            </Space>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PreviewHeader;
