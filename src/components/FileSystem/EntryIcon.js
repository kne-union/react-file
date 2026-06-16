import React from 'react';
import classnames from 'classnames';
import FileType from '@kne/react-file-type';
import { ReactComponent as FolderIcon } from './icons/folder.svg';
import { fileExtension } from './utils';
import style from './FileSystem.module.scss';

const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 40,
  xl: 64
};

const EntryIcon = ({ entry, className, size = 'md' }) => {
  const pixelSize = ICON_SIZES[size] || ICON_SIZES.md;

  return (
    <span aria-hidden className={classnames(style['entry-icon-slot'], style[`entry-icon-slot-${size}`], entry.kind === 'folder' && style['entry-icon-slot-folder'], className)}>
      {entry.kind === 'folder' ? <FolderIcon focusable="false" className={classnames(style['entry-icon'], style['entry-icon-folder'])} /> : <FileType type={fileExtension(entry.name || entry.path)} size={pixelSize} />}
    </span>
  );
};

export default EntryIcon;
