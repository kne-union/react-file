import classnames from 'classnames';
import PreviewHeader from './PreviewHeader';
import style from './style.module.scss';

const PreviewShell = ({ showHeader = true, className, headerFooter, bodyClassName, bodyStyle, bodyRef, children, filename, extra, actions = [], overlay }) => {
  const headerNode = showHeader ? <PreviewHeader filename={filename} extra={extra} actions={actions} /> : null;
  // 浮层挂在滚动容器外层，滚动内容时翻页按钮始终固定在展示区可视范围内
  const bodyNode = (
    <div ref={bodyRef} className={classnames(style['office-viewer-body'], bodyClassName)} style={bodyStyle}>
      {children}
    </div>
  );

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
      {overlay ? (
        <div className={style['office-viewer-wrap']}>
          {bodyNode}
          {overlay}
        </div>
      ) : (
        bodyNode
      )}
    </div>
  );
};

export default PreviewShell;
