import { useCallback, useEffect, useRef } from 'react';
import { Modal, Space, App } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { findExamplePhoneMountNode, useMobilePopupMount, useScrollElement } from '@kne/responsive-utils';
import { DownloadInner } from '../Download';
import { PrintButtonInner } from '../PrintButton';
import { FilePreviewInner, typeFormat } from '../FilePreview';
import useControlValue from '@kne/use-control-value';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import style from './style.module.scss';
import previewStyle from '../FilePreview/style.module.scss';

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

export const useFileModalProps = p => {
  const { formatMessage } = useIntl();
  const { title, filename, originName, openDownload, openPrint, id, src, apis, isMobile, ...props } = Object.assign(
    {},
    {
      footer: null,
      openDownload: false,
      openPrint: false,
      isMobile: false
    },
    p
  );
  const [open, onOpenChange] = useControlValue(props, {
    value: 'open',
    default: 'defaultOpen',
    onChange: 'onOpenChange'
  });
  const { message } = App.useApp();
  const ref = useRef();
  return {
    ...props,
    open,
    onOpenChange,
    onCancel: () => {
      onOpenChange(false);
    },
    title: (
      <Space size={10} className={style['file-title']}>
        <span className={style['ellipse']}>{title || filename || originName}</span>
        <span>
          {openDownload && (
            <DownloadInner
              className="btn-no-padding"
              type="link"
              id={id}
              src={src}
              apis={apis}
              filename={filename || originName}
              onSuccess={() => {
                message.success(formatMessage({ id: 'Download.downloadSuccess' }));
              }}
            />
          )}
          {openPrint && ['txt', 'pdf', 'image', 'html'].indexOf(typeFormat(filename || originName)) > -1 && <PrintButtonInner contentRef={ref} type="link" icon={<PrinterOutlined />} />}
        </span>
      </Space>
    ),
    children: (
      <div ref={ref} className={classnames(style['file-modal-outer'], isMobile && style['file-modal-outer-mobile'])}>
        <FilePreviewInner id={id} src={src} filename={filename || originName} apis={apis} className={previewStyle['modal-preview']} />
      </div>
    )
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
              : propsStyle
          }
          wrapClassName={classnames(wrapClassName, isMobile && style['file-modal-wrap-fullscreen'], isMobile && fixedModeClass)}
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
