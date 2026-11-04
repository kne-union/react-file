import React, { isValidElement } from 'react';
import classnames from 'classnames';
import FileType from '@kne/react-file-type';
import { CheckOutlined, CloseOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { ReactComponent as FolderIcon } from './icons/folder.svg';
import { fileExtension } from './utils';
import { useFileSystemContext } from './FileSystemContext';
import style from './FileSystem.module.scss';

const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 40,
  xl: 64
};

/** 状态别名 → 语义 key */
const STATUS_ALIAS = {
  sync: 'sync',
  同步: 'sync',
  error: 'error',
  fail: 'error',
  failed: 'error',
  错误: 'error',
  失败: 'error',
  success: 'success',
  done: 'success',
  complete: 'success',
  completed: 'success',
  完成: 'success',
  成功: 'success',
  processing: 'processing',
  pending: 'processing',
  loading: 'processing',
  progress: 'processing',
  running: 'processing',
  进行中: 'processing',
  处理中: 'processing',
  cancelled: 'cancelled',
  canceled: 'cancelled',
  已取消: 'cancelled',
  取消: 'cancelled'
};

const STATUS_ICONS = {
  sync: <SyncOutlined spin />,
  error: <CloseOutlined />,
  success: <CheckOutlined />,
  processing: <LoadingOutlined spin />,
  cancelled: <CloseOutlined />
};

const resolveEntryStatus = (entry, statusProp) => {
  if (statusProp !== undefined) {
    return statusProp;
  }
  if (entry?.status !== undefined) {
    return entry.status;
  }
  if (entry?.options?.status !== undefined) {
    return entry.options.status;
  }
  return null;
};

const resolveStatusBadge = status => {
  if (status == null || status === false || status === '') {
    return null;
  }
  if (isValidElement(status)) {
    return { tone: 'custom', content: status };
  }
  if (typeof status === 'string') {
    const key = STATUS_ALIAS[status] || STATUS_ALIAS[status.toLowerCase()];
    if (!key) {
      return null;
    }
    return { tone: key, content: STATUS_ICONS[key] };
  }
  return null;
};

const EntryIcon = ({ entry, className, size = 'md', status: statusProp }) => {
  const pixelSize = ICON_SIZES[size] || ICON_SIZES.md;
  const badge = resolveStatusBadge(resolveEntryStatus(entry, statusProp));
  const renderEntryIcon = useFileSystemContext()?.renderEntryIcon;

  let icon;
  if (entry.kind === 'folder') {
    icon = <FolderIcon focusable="false" className={classnames(style['entry-icon'], style['entry-icon-folder'])} />;
  } else {
    icon = <FileType type={fileExtension(entry.name || entry.path)} size={pixelSize} />;
    if (typeof renderEntryIcon === 'function') {
      const custom = renderEntryIcon({ entry, size, pixelSize, icon });
      if (custom != null && custom !== false) {
        icon = custom;
      }
    }
  }

  return (
    <span aria-hidden className={classnames(style['entry-icon-slot'], style[`entry-icon-slot-${size}`], entry.kind === 'folder' && style['entry-icon-slot-folder'], className)}>
      {icon}
      {badge ? <span className={classnames(style['entry-status'], style[`entry-status-${badge.tone}`])}>{badge.content}</span> : null}
    </span>
  );
};

export { resolveEntryStatus, resolveStatusBadge, STATUS_ALIAS };
export default EntryIcon;
