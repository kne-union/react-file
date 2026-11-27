import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Modal, Space, App } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { findExamplePhoneMountNode, useIsMobile, useMobilePopupMount, useScrollElement } from '@kne/responsive-utils';
import { DownloadInner } from '../Download';
import { PrintButtonInner } from '../PrintButton';
import { FilePreviewInner, typeFormat } from '../FilePreview';
import useControlValue from '@kne/use-control-value';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import style from './style.module.scss';
import previewStyle from '../FilePreview/style.module.scss';
import { ImageToolbarProvider } from '../FilePreview/imageToolbarContext';

let parentScrollLockCount = 0;
let parentScrollLocked = [];

const lockParentScroll = getScrollElement => {
  parentScrollLockCount += 1;
  if (parentScrollLockCount === 1) {
    const targets = [];
    if (typeof document !== 'undefined') {
      targets.push(document.body);
      if (document.documentElement) {
        targets.push(document.documentElement);
      }
    }
    const scrollEl = typeof getScrollElement === 'function' ? getScrollElement() : null;
    if (scrollEl && !targets.includes(scrollEl)) {
      targets.push(scrollEl);
    }
    parentScrollLocked = targets.map(el => {
      const prev = {
        overflow: el.style.overflow,
        overscrollBehavior: el.style.overscrollBehavior
      };
      el.style.overflow = 'hidden';
      el.style.overscrollBehavior = 'none';
      return { el, prev };
    });
  }
  return () => {
    parentScrollLockCount = Math.max(0, parentScrollLockCount - 1);
    if (parentScrollLockCount === 0) {
      parentScrollLocked.forEach(({ el, prev }) => {
        el.style.overflow = prev.overflow;
        el.style.overscrollBehavior = prev.overscrollBehavior;
      });
      parentScrollLocked = [];
    }
  };
};

const useLockParentScroll = (enabled, getScrollElement) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    return lockParentScroll(getScrollElement);
  }, [enabled, getScrollElement]);
};

// 标题与正文是两棵独立子树，且命令式弹窗会固定 title/children，二者只能经由每次打开新建的 store 通信，不能依赖宿主组件 state
const createFileModalStore = () => {
  let toolbarContainer = null;
  const listeners = new Set();
  return {
    contentRef: { current: null },
    setToolbarContainer: node => {
      toolbarContainer = node;
      listeners.forEach(listener => listener());
    },
    getToolbarContainer: () => toolbarContainer,
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

const FileModalTitle = withLocale(({ store, displayName, filename, id, src, apis, showDownload, showPrint }) => {
  const { formatMessage } = useIntl();
  const { message } = App.useApp();
  return (
    <div className={style['file-title']}>
      <span className={style['file-title-text']} title={typeof displayName === 'string' ? displayName : undefined}>
        {displayName}
      </span>
      <span ref={store.setToolbarContainer} className={style['file-title-toolbar']} />
      {showDownload || showPrint ? (
        <Space size={4} className={style['file-title-actions']}>
          {showDownload && (
            <DownloadInner
              type="text"
              id={id}
              src={src}
              apis={apis}
              filename={filename}
              onSuccess={() => {
                message.success(formatMessage({ id: 'Download.downloadSuccess' }));
              }}
            />
          )}
          {showPrint && <PrintButtonInner contentRef={store.contentRef} type="text" icon={<PrinterOutlined />} />}
        </Space>
      ) : null}
    </div>
  );
});

const FileModalContent = withLocale(({ store, filename, id, src, apis, isMobile: isMobileProp }) => {
  const isMobileQuery = useIsMobile();
  const isMobile = typeof isMobileProp === 'boolean' ? isMobileProp : isMobileQuery;
  const toolbarContainer = useSyncExternalStore(store.subscribe, store.getToolbarContainer);
  const toolbar = useMemo(() => ({ container: toolbarContainer }), [toolbarContainer]);
  return (
    <div ref={store.contentRef} className={classnames(style['file-modal-outer'], isMobile && style['file-modal-outer-mobile'])}>
      <ImageToolbarProvider value={toolbar}>
        <FilePreviewInner id={id} src={src} filename={filename} apis={apis} className={previewStyle['modal-preview']} />
      </ImageToolbarProvider>
    </div>
  );
});

const buildFileModalProps = (p, store) => {
  const {
    title,
    filename: filenameProp,
    originName,
    openDownload,
    openPrint,
    id,
    src,
    apis,
    isMobile,
    ...props
  } = Object.assign(
    {},
    {
      footer: null,
      width: 'min(1200px, calc(100vw - 48px))',
      openPrint: false
    },
    p
  );
  const filename = filenameProp || originName;
  const fileProps = { store, filename, id, src, apis };
  return {
    ...props,
    title: <FileModalTitle {...fileProps} displayName={title || filename} showDownload={openDownload !== false} showPrint={openPrint && ['txt', 'pdf', 'image', 'html'].indexOf(typeFormat(filename)) > -1} />,
    children: <FileModalContent {...fileProps} isMobile={isMobile} />
  };
};

export const getFileModalProps = props => buildFileModalProps(props, createFileModalStore());

export const useFileModalProps = p => {
  const [store] = useState(createFileModalStore);
  const props = buildFileModalProps(p, store);
  const [open, onOpenChange] = useControlValue(props, {
    value: 'open',
    default: 'defaultOpen',
    onChange: 'onOpenChange'
  });
  const onClose = () => {
    onOpenChange(false);
  };
  return {
    ...props,
    open,
    onOpenChange,
    onClose,
    onCancel: onClose
  };
};

export const useFileModal = p => {
  const { renderModal: renderModalProp, getContainer: getContainerProp, ...props } = Object.assign({}, p);
  const useCustomRenderModal = typeof renderModalProp === 'function';
  const hostRef = useRef(null);
  const getContainerPropRef = useRef(getContainerProp);
  getContainerPropRef.current = getContainerProp;

  // 优先挂到当前 example 手机框（anchor.closest），避免落到页面上别的 example boundary
  const resolveExampleGetContainer = useCallback(triggerNode => {
    const prop = getContainerPropRef.current;
    if (prop) {
      const custom = typeof prop === 'function' ? prop(triggerNode) : prop;
      if (custom) {
        return custom;
      }
    }
    return findExamplePhoneMountNode(triggerNode || hostRef.current);
  }, []);

  const { isMobile, fixedModeClass, getPopupContainer, anchorRef } = useMobilePopupMount({
    cover: 'viewport',
    getPopupContainer: resolveExampleGetContainer
  });

  const setHostRef = useCallback(
    node => {
      hostRef.current = node;
      anchorRef(node);
    },
    [anchorRef]
  );

  const fileProps = useFileModalProps(Object.assign({}, props, { isMobile }));
  const getScrollElement = useScrollElement();
  // 自定义 renderModal（如 components-core Modal）自带滚动锁定，避免双重 lock 互相还原
  useLockParentScroll(!!fileProps.open && !useCustomRenderModal, getScrollElement);

  const defaultRenderModal = modalProps => {
    const { wrapClassName, classNames: propsClassNames, styles: propsStyles, width, style: propsStyle, getContainer: _getContainer, ...rest } = modalProps;
    return (
      <>
        <span ref={setHostRef} className={style['file-modal-host']} aria-hidden="true" />
        <Modal
          {...rest}
          width={isMobile ? 'var(--kne-viewport-width, 100vw)' : width}
          style={
            isMobile
              ? Object.assign({}, propsStyle, {
                  top: 0,
                  maxWidth: '100%',
                  margin: 0,
                  paddingBottom: 0,
                  height: 'var(--kne-viewport-height, 100vh)'
                })
              : Object.assign({ top: 24, paddingBottom: 0 }, propsStyle)
          }
          wrapClassName={classnames(wrapClassName, style['file-modal-wrap'], isMobile && style['file-modal-wrap-fullscreen'], isMobile && fixedModeClass)}
          classNames={Object.assign({}, propsClassNames, {
            mask: classnames(propsClassNames?.mask, isMobile && style['file-modal-mask-fullscreen'], isMobile && fixedModeClass)
          })}
          styles={
            isMobile
              ? Object.assign({}, propsStyles, {
                  content: Object.assign({}, propsStyles?.content, {
                    borderRadius: 0,
                    height: '100%',
                    maxHeight: '100%',
                    overflow: 'hidden',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }),
                  body: Object.assign({}, propsStyles?.body, {
                    flex: 1,
                    minHeight: 0,
                    height: 'auto',
                    maxHeight: 'none',
                    overflow: 'hidden',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column'
                  })
                })
              : propsStyles
          }
          getContainer={getPopupContainer}
        />
      </>
    );
  };

  const renderModal = useCustomRenderModal ? renderModalProp : defaultRenderModal;

  return Object.assign({}, fileProps, {
    isMobile,
    renderModal: nextProps => renderModal(Object.assign({}, fileProps, nextProps))
  });
};

const FileModalInner = p => {
  const { renderModal } = useFileModal(p);
  return renderModal();
};

export { FileModalInner };
export default withLocale(FileModalInner);
