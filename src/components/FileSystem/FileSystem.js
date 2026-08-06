import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Input, Segmented, Table, Tree } from 'antd';
import { AppstoreOutlined, ArrowLeftOutlined, ArrowRightOutlined, ColumnWidthOutlined, PictureOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';
import classnames from 'classnames';
import style from './FileSystem.module.scss';
import EntryIcon from './EntryIcon';
import PropertiesPanel from './PropertiesPanel';
import MarqueeSelect from './MarqueeSelect';
import { buildFileSystemIndex, buildNestedEntries, formatByteSize, normalizeFolderPath, normalizeSearchQuery, pathName, pathParent } from './utils';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const isToggleModifier = event => !!(event && (event.metaKey || event.ctrlKey));
const isRangeModifier = event => !!(event && event.shiftKey);
/** 移动端不触发 dblclick，用两次点击间隔模拟双击打开 */
const DOUBLE_TAP_MS = 350;

const isMobileDoubleTap = (lastTapRef, path) => {
  if (!path) {
    return false;
  }
  const now = Date.now();
  const last = lastTapRef.current;
  if (last.path === path && now - last.at <= DOUBLE_TAP_MS) {
    lastTapRef.current = { path: null, at: 0 };
    return true;
  }
  lastTapRef.current = { path, at: now };
  return false;
};

const FileSystemInner = ({
  items,
  className,
  title = 'Files',
  defaultView = 'list',
  defaultPath = '',
  toolbarExtra,
  propertiesPanel = true,
  propertiesActions,
  onPropertiesAction,
  onSelectionChange,
  onPathChange,
  onFileOpen,
  renderFilePreview,
  canPreviewFile,
  getEntryStatus
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useIsMobile();
  const [view, setView] = useState(defaultView);
  const [history, setHistory] = useState(() => ({
    index: 0,
    stack: [normalizeFolderPath(defaultPath)]
  }));
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [selectionAnchorPath, setSelectionAnchorPath] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [columnAnchorPath, setColumnAnchorPath] = useState('');
  const [propertiesPanelClosed, setPropertiesPanelClosed] = useState(false);
  const [marqueeDragging, setMarqueeDragging] = useState(false);
  const marqueeSessionRef = useRef(null);
  const lastTapRef = useRef({ path: null, at: 0 });
  const selectedPathsRef = useRef(selectedPaths);
  selectedPathsRef.current = selectedPaths;

  const index = useMemo(() => buildFileSystemIndex(items), [items]);
  const currentPath = history.stack[history.index] ?? '';
  const searchQuery = normalizeSearchQuery(searchInput);
  const isSearching = searchQuery.length > 0;

  const selectedEntries = useMemo(() => {
    return selectedPaths.map(path => index.files.get(path) || index.folders.get(path)).filter(Boolean);
  }, [index, selectedPaths]);

  const currentEntries = useMemo(() => {
    const entries = index.children.get(currentPath) || [];

    if (!isSearching) {
      return entries;
    }

    return entries.filter(entry => entry.path.slice(currentPath.length).toLowerCase().includes(searchQuery));
  }, [currentPath, index, isSearching, searchQuery]);

  const nestedEntries = useMemo(() => buildNestedEntries(index), [index]);

  const columnPaths = useMemo(() => {
    const activePath = columnAnchorPath || currentPath;
    const chain = [];
    let path = activePath;

    while (path) {
      chain.unshift(path);
      path = pathParent(path);
    }

    return ['', ...chain];
  }, [columnAnchorPath, currentPath]);

  const emitSelectionChange = useCallback(
    paths => {
      const entries = paths.map(path => index.files.get(path) || index.folders.get(path)).filter(Boolean);
      onSelectionChange?.(entries);
    },
    [index, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    setSelectedPaths([]);
    setSelectionAnchorPath(null);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const handlePropertiesAction = useCallback(
    (key, ctx) => {
      onPropertiesAction?.(key, Object.assign({}, ctx, { clearSelection, currentPath }));
    },
    [clearSelection, currentPath, onPropertiesAction]
  );

  useEffect(() => {
    if (selectedPaths.length > 0) {
      setPropertiesPanelClosed(false);
    }
  }, [selectedPaths]);

  // 画廊进入目录后若当前无选中项，默认选中并预览第一项
  useEffect(() => {
    if (view !== 'gallery') {
      return;
    }
    const hasSelectedInFolder = selectedPathsRef.current.some(path => currentEntries.some(entry => entry.path === path));
    if (hasSelectedInFolder || currentEntries.length === 0) {
      return;
    }
    const firstPath = currentEntries[0].path;
    setSelectedPaths([firstPath]);
    setSelectionAnchorPath(firstPath);
    emitSelectionChange([firstPath]);
  }, [view, currentPath, currentEntries, emitSelectionChange]);

  const selectEntry = useCallback(
    (entry, event) => {
      const path = entry?.path ?? null;
      if (!path) {
        return;
      }

      let nextPaths;
      let nextAnchor = path;

      if (isRangeModifier(event) && selectionAnchorPath) {
        const anchorIndex = currentEntries.findIndex(item => item.path === selectionAnchorPath);
        const targetIndex = currentEntries.findIndex(item => item.path === path);

        if (anchorIndex >= 0 && targetIndex >= 0) {
          const [start, end] = anchorIndex < targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
          nextPaths = currentEntries.slice(start, end + 1).map(item => item.path);
          nextAnchor = selectionAnchorPath;
        } else {
          nextPaths = [path];
        }
      } else if (isToggleModifier(event)) {
        if (selectedPaths.includes(path)) {
          nextPaths = selectedPaths.filter(item => item !== path);
        } else {
          nextPaths = [...selectedPaths, path];
        }
      } else {
        nextPaths = [path];
      }

      setSelectedPaths(nextPaths);
      setSelectionAnchorPath(nextAnchor);
      emitSelectionChange(nextPaths);
    },
    [currentEntries, emitSelectionChange, selectedPaths, selectionAnchorPath]
  );

  const handleMarqueeSelect = useCallback(
    (paths, { additive, preview, dragging } = {}) => {
      if (dragging != null) {
        setMarqueeDragging(!!dragging);
      }

      if (!marqueeSessionRef.current) {
        marqueeSessionRef.current = {
          base: additive ? selectedPathsRef.current.slice() : []
        };
      }

      const nextPaths = additive ? [...new Set([...marqueeSessionRef.current.base, ...paths])] : paths;
      setSelectedPaths(nextPaths);
      if (nextPaths.length > 0) {
        setSelectionAnchorPath(nextPaths[nextPaths.length - 1]);
      } else if (!additive) {
        setSelectionAnchorPath(null);
      }

      if (!preview) {
        setMarqueeDragging(false);
        emitSelectionChange(nextPaths);
        marqueeSessionRef.current = null;
      }
    },
    [emitSelectionChange]
  );

  const handleEmptyClick = useCallback(() => {
    marqueeSessionRef.current = null;
    clearSelection();
  }, [clearSelection]);

  const navigateTo = useCallback(
    folderPath => {
      const path = normalizeFolderPath(folderPath);
      setHistory(previous => {
        if (previous.stack[previous.index] === path) return previous;
        const stack = [...previous.stack.slice(0, previous.index + 1), path];
        return { index: stack.length - 1, stack };
      });
      setSearchInput('');
      clearSelection();
      setColumnAnchorPath(path);
      onPathChange?.(path);
    },
    [clearSelection, onPathChange]
  );

  const goBack = useCallback(() => {
    setHistory(previous => {
      const index = Math.max(0, previous.index - 1);
      const path = previous.stack[index] ?? '';
      queueMicrotask(() => onPathChange?.(path));
      return {
        ...previous,
        index
      };
    });
    setSearchInput('');
    clearSelection();
  }, [clearSelection, onPathChange]);

  const goForward = useCallback(() => {
    setHistory(previous => {
      const index = Math.min(previous.stack.length - 1, previous.index + 1);
      const path = previous.stack[index] ?? '';
      queueMicrotask(() => onPathChange?.(path));
      return {
        ...previous,
        index
      };
    });
    setSearchInput('');
    clearSelection();
  }, [clearSelection, onPathChange]);

  const openEntry = useCallback(
    entry => {
      if (!entry) return;

      if (entry.kind === 'folder') {
        navigateTo(entry.path);
        return;
      }

      onFileOpen?.(entry);
    },
    [navigateTo, onFileOpen]
  );

  const handleEntryClick = useCallback(
    (entry, event) => {
      if (isMobile && isMobileDoubleTap(lastTapRef, entry?.path)) {
        openEntry(entry);
        return;
      }
      selectEntry(entry, event);
    },
    [isMobile, openEntry, selectEntry]
  );

  const handleEntryDoubleClick = useCallback(
    entry => {
      if (isMobile) {
        return;
      }
      openEntry(entry);
    },
    [isMobile, openEntry]
  );

  const resolveStatus = useCallback(entry => (typeof getEntryStatus === 'function' ? getEntryStatus(entry) : undefined), [getEntryStatus]);

  const treeData = useMemo(() => {
    const renderTitle = entry => (
      <span className={classnames(style['list-name'], entry.kind === 'folder' && style['list-name-folder'])} title={entry.name}>
        <span className={style['name-clamp']}>
          {entry.name}
          {entry.kind === 'file' ? ` · ${formatByteSize(entry.size)}` : ''}
        </span>
      </span>
    );

    const mapNode = entry => ({
      key: entry.path,
      entry,
      title: renderTitle(entry),
      icon: <EntryIcon entry={entry} size="sm" status={resolveStatus(entry)} />,
      isLeaf: entry.kind === 'file',
      children: entry.children ? entry.children.map(mapNode) : undefined
    });

    return nestedEntries.map(mapNode);
  }, [nestedEntries, resolveStatus]);

  const currentFolderName = currentPath === '' ? title : pathName(currentPath) || title;
  const canGoBack = history.index > 0;
  const canGoForward = history.index < history.stack.length - 1;

  const viewOptions = useMemo(
    () => [
      { label: formatMessage({ id: 'FileSystem.viewGrid' }), value: 'icons', icon: <AppstoreOutlined /> },
      { label: formatMessage({ id: 'FileSystem.viewList' }), value: 'list', icon: <UnorderedListOutlined /> },
      { label: formatMessage({ id: 'FileSystem.viewColumns' }), value: 'columns', icon: <ColumnWidthOutlined /> },
      { label: formatMessage({ id: 'FileSystem.viewGallery' }), value: 'gallery', icon: <PictureOutlined /> }
    ],
    [formatMessage]
  );

  const segmentedOptions = useMemo(
    () =>
      viewOptions.map(option =>
        isMobile
          ? {
              value: option.value,
              icon: option.icon,
              title: option.label
            }
          : {
              label: option.label,
              value: option.value,
              icon: option.icon
            }
      ),
    [isMobile, viewOptions]
  );

  const columns = [
    {
      title: formatMessage({ id: 'FileSystem.columnName' }),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <span className={classnames(style['list-name'], record.kind === 'folder' && style['list-name-folder'])} title={record.name}>
          <EntryIcon entry={record} size="sm" status={resolveStatus(record)} />
          <span className={style['name-clamp']}>{record.name}</span>
        </span>
      )
    },
    {
      title: formatMessage({ id: 'FileSystem.columnSize' }),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (_, record) => (record.kind === 'file' ? formatByteSize(record.size) : '-')
    }
  ];

  const renderContent = () => {
    if (currentEntries.length === 0) {
      return (
        <div className={style['empty-wrap']}>
          <Empty description={isSearching ? formatMessage({ id: 'FileSystem.notFound' }, { keyword: searchInput.trim() }) : formatMessage({ id: 'FileSystem.emptyFolder' })} />
        </div>
      );
    }

    if (view === 'icons') {
      return <IconsView entries={currentEntries} selectedPaths={selectedPaths} onSelect={handleEntryClick} onOpen={handleEntryDoubleClick} resolveStatus={resolveStatus} />;
    }

    if (view === 'list') {
      if (isSearching) {
        return <ListTableView columns={columns} entries={currentEntries} selectedPaths={selectedPaths} onSelect={handleEntryClick} onOpen={handleEntryDoubleClick} />;
      }

      return <ListView treeData={treeData} expandedKeys={expandedKeys} onExpand={setExpandedKeys} selectedPaths={selectedPaths} onSelect={selectEntry} onOpen={openEntry} isMobile={isMobile} lastTapRef={lastTapRef} />;
    }

    if (view === 'columns') {
      return (
        <ColumnsView
          columnPaths={columnPaths}
          index={index}
          selectedPaths={selectedPaths}
          onSelect={selectEntry}
          onOpen={openEntry}
          onNavigateColumn={setColumnAnchorPath}
          resolveStatus={resolveStatus}
          isMobile={isMobile}
          lastTapRef={lastTapRef}
        />
      );
    }

    return (
      <GalleryView
        entries={currentEntries}
        selectedPaths={selectedPaths}
        onSelect={handleEntryClick}
        onOpen={handleEntryDoubleClick}
        renderFilePreview={renderFilePreview}
        canPreviewFile={canPreviewFile}
        formatMessage={formatMessage}
        resolveStatus={resolveStatus}
      />
    );
  };

  const footerSelection =
    selectedEntries.length > 1 ? (
      <span>· {formatMessage({ id: 'FileSystem.selectedCount' }, { count: selectedEntries.length })}</span>
    ) : selectedEntries.length === 1 ? (
      <span>· {formatMessage({ id: 'FileSystem.selected' }, { name: selectedEntries[0].name })}</span>
    ) : null;

  const showPropertiesPanel = propertiesPanel !== false && selectedEntries.length > 0 && !propertiesPanelClosed && !marqueeDragging;
  const marqueeEnabled = !isMobile && (view === 'icons' || view === 'columns' || view === 'gallery' || (view === 'list' && isSearching));

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.toolbar}>
        <Input allowClear size="small" className={style['search-input']} placeholder={formatMessage({ id: 'FileSystem.search' })} prefix={<SearchOutlined />} value={searchInput} onChange={event => setSearchInput(event.target.value)} />
        <div className={style['toolbar-nav']}>
          <Button type="text" size="small" icon={<ArrowLeftOutlined />} disabled={!canGoBack} onClick={goBack} />
          <Button type="text" size="small" icon={<ArrowRightOutlined />} disabled={!canGoForward} onClick={goForward} />
        </div>
        <div className={style['toolbar-title']} title={currentFolderName}>
          {currentFolderName}
        </div>
        {toolbarExtra ? <div className={style['toolbar-extra']}>{typeof toolbarExtra === 'function' ? toolbarExtra({ selectedEntries, clearSelection, currentPath }) : toolbarExtra}</div> : null}
        <Segmented size="small" className={style['view-switch']} value={view} onChange={setView} options={segmentedOptions} />
      </div>
      <div className={style.main}>
        <div className={style.content}>
          <MarqueeSelect enabled={marqueeEnabled} className={view === 'gallery' || view === 'columns' ? style['marquee-fill'] : undefined} onMarqueeSelect={handleMarqueeSelect} onEmptyClick={handleEmptyClick}>
            {renderContent()}
          </MarqueeSelect>
        </div>
        {showPropertiesPanel ? (
          <PropertiesPanel
            selectedEntries={selectedEntries}
            index={index}
            currentPath={currentPath}
            propertiesPanel={propertiesPanel}
            propertiesActions={propertiesActions}
            onPropertiesAction={handlePropertiesAction}
            onClose={() => setPropertiesPanelClosed(true)}
          />
        ) : null}
      </div>
      <div className={style.footer}>
        <span>
          {currentEntries.length} {isSearching ? formatMessage({ id: 'FileSystem.resultCount' }) : formatMessage({ id: 'FileSystem.itemCount' })}
        </span>
        {footerSelection}
      </div>
    </div>
  );
};

const IconsView = ({ entries, selectedPaths, onSelect, onOpen, resolveStatus }) => {
  return (
    <div className={style['icons-grid']}>
      {entries.map(entry => (
        <div key={entry.path} data-fs-path={entry.path} className={classnames(style['icon-item'], selectedPaths.includes(entry.path) && style.selected)} onClick={event => onSelect(entry, event)} onDoubleClick={() => onOpen(entry)}>
          <EntryIcon entry={entry} size="lg" status={resolveStatus?.(entry)} />
          <span className={style['icon-label']} title={entry.name}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
};

const ListView = ({ treeData, expandedKeys, onExpand, selectedPaths, onSelect, onOpen, isMobile, lastTapRef }) => {
  const activateEntry = useCallback(
    entry => {
      if (!entry) {
        return;
      }

      if (entry.kind === 'folder') {
        if (expandedKeys.includes(entry.path)) {
          onExpand(expandedKeys.filter(key => key !== entry.path && !key.startsWith(entry.path)));
          return;
        }

        onExpand([...expandedKeys, entry.path]);
        onOpen(entry);
        return;
      }

      onOpen(entry);
    },
    [expandedKeys, onExpand, onOpen]
  );

  const handleSelect = useCallback(
    (_, info) => {
      const entry = info.node.entry;
      if (isMobile && isMobileDoubleTap(lastTapRef, entry?.path)) {
        activateEntry(entry);
        return;
      }
      onSelect(entry, info.nativeEvent);
    },
    [activateEntry, isMobile, lastTapRef, onSelect]
  );

  const handleDoubleClick = useCallback(
    (_, node) => {
      if (isMobile) {
        return;
      }
      activateEntry(node.entry);
    },
    [activateEntry, isMobile]
  );

  return (
    <div className={style['tree-wrap']}>
      <Tree showIcon blockNode multiple treeData={treeData} expandedKeys={expandedKeys} selectedKeys={selectedPaths} onExpand={onExpand} onSelect={handleSelect} onDoubleClick={handleDoubleClick} />
    </div>
  );
};

const ListTableView = ({ columns, entries, selectedPaths, onSelect, onOpen }) => {
  return (
    <Table
      className={style['list-table']}
      size="small"
      pagination={false}
      rowKey="path"
      columns={columns}
      dataSource={entries}
      rowClassName={record => (selectedPaths.includes(record.path) ? 'ant-table-row-selected' : '')}
      onRow={record => ({
        'data-fs-path': record.path,
        onClick: event => onSelect(record, event),
        onDoubleClick: () => onOpen(record)
      })}
    />
  );
};

const ColumnsView = ({ columnPaths, index, selectedPaths, onSelect, onOpen, onNavigateColumn, resolveStatus, isMobile, lastTapRef }) => {
  return (
    <div className={style['columns-wrap']}>
      {columnPaths.map(path => {
        const entries = index.children.get(path) || [];

        return (
          <div key={path || 'root'} className={style.column}>
            {entries.map(entry => (
              <div
                key={entry.path}
                data-fs-path={entry.path}
                className={classnames(style['column-item'], selectedPaths.includes(entry.path) && style.selected)}
                onClick={event => {
                  if (isMobile && isMobileDoubleTap(lastTapRef, entry.path)) {
                    onOpen(entry);
                    return;
                  }
                  onSelect(entry, event);
                  if (entry.kind === 'folder') {
                    onNavigateColumn(entry.path);
                  }
                }}
                onDoubleClick={() => {
                  if (!isMobile) {
                    onOpen(entry);
                  }
                }}
              >
                <EntryIcon entry={entry} size="sm" status={resolveStatus?.(entry)} />
                <span className={style['column-name']} title={entry.name}>
                  {entry.name}
                </span>
                {entry.kind === 'file' ? <span className={style['column-meta']}>{formatByteSize(entry.size)}</span> : null}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const GalleryView = ({ entries, selectedPaths, onSelect, onOpen, renderFilePreview, canPreviewFile, formatMessage, resolveStatus }) => {
  const filmstripRef = useRef(null);
  const primaryPath = selectedPaths[selectedPaths.length - 1];
  const selectedEntry = entries.find(entry => entry.path === primaryPath) || entries[0] || null;
  const activePath = selectedEntry?.path || null;

  useEffect(() => {
    if (!activePath || !filmstripRef.current) {
      return;
    }
    const item = filmstripRef.current.querySelector(`[data-fs-path="${CSS.escape(activePath)}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [activePath]);

  const renderPlaceholder = entry => (
    <div className={style['gallery-preview']}>
      <EntryIcon entry={entry} size="xl" status={resolveStatus?.(entry)} />
      <div className={style['gallery-name']} title={entry.name}>
        {entry.name}
      </div>
      <div className={style['gallery-meta']}>{entry.kind === 'file' ? formatByteSize(entry.size) : formatMessage({ id: 'FileSystem.folder' })}</div>
    </div>
  );

  const renderStage = () => {
    if (!selectedEntry) {
      return (
        <div className={style['gallery-preview']}>
          <Empty description={formatMessage({ id: 'FileSystem.emptyFolder' })} />
        </div>
      );
    }

    if (selectedEntry.kind === 'folder') {
      return renderPlaceholder(selectedEntry);
    }

    if (selectedEntry.kind === 'file' && renderFilePreview && (!canPreviewFile || canPreviewFile(selectedEntry))) {
      const preview = renderFilePreview(selectedEntry);
      if (preview) {
        return (
          <div className={style['gallery-stage-content']}>
            <div className={style['gallery-stage-content-inner']}>{preview}</div>
          </div>
        );
      }
    }

    return renderPlaceholder(selectedEntry);
  };

  return (
    <div className={style.gallery}>
      <div className={style['gallery-stage']}>{renderStage()}</div>
      <div className={style['gallery-sidebar']}>
        <div className={style['gallery-sidebar-title']}>{formatMessage({ id: 'FileSystem.currentFolder' })}</div>
        <div className={style['gallery-filmstrip']} ref={filmstripRef}>
          {entries.map(entry => (
            <div key={entry.path} data-fs-path={entry.path} className={classnames(style['gallery-film-item'], entry.path === activePath && style.selected)} onClick={event => onSelect(entry, event)} onDoubleClick={() => onOpen(entry)}>
              <EntryIcon entry={entry} size="sm" status={resolveStatus?.(entry)} />
              <span className={style['column-name']} title={entry.name}>
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FileSystem = withLocale(FileSystemInner);

FileSystem.PropertiesPanel = PropertiesPanel;

export { FileSystemInner, PropertiesPanel };
export default FileSystem;
