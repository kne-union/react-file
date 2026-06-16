import classnames from 'classnames';
import PreviewHeader from './PreviewHeader';
import style from './style.module.scss';

const PreviewShell = ({ showHeader = true, className, headerFooter, bodyClassName, bodyStyle, bodyRef, children, filename, extra, actions = [] }) => {
  const headerNode = showHeader ? <PreviewHeader filename={filename} extra={extra} actions={actions} /> : null;

  return (
    <div className={classnames(className, style.container, style['office-preview'])}>
      {headerNode ? (
        headerFooter ? (
          <div className={style['office-toolbar-stack']}>
            {headerNode}
            {headerFooter}
          </div>
        ) : (
          headerNode
        )
      ) : null}
      <div ref={bodyRef} className={classnames(style['office-viewer-body'], bodyClassName)} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

export default PreviewShell;
