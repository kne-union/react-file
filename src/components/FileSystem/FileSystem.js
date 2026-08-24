import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Input, Segmented, Table, Tree } from 'antd';
import { AppstoreOutlined, ArrowLeftOutlined, ColumnWidthOutlined, PictureOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useIsMobile } from '@kne/responsive-utils';
import classnames from 'classnames';
import style from './FileSystem.module.scss';
import EntryIcon from './EntryIcon';
import PropertiesPanel from './PropertiesPanel';
import MarqueeSelect from './MarqueeSelect';
import FileSystemContext from './FileSystemContext';
import { IconsView as VirtualIconsView, ListTableView as VirtualListTableView, ColumnsView as VirtualColumnsView, GalleryView as VirtualGalleryView } from './VirtualViews';
import { buildFileSystemIndex, buildNestedEntries, formatByteSize, normalizeFolderPath, normalizeSearchQuery, pathName, pathParent } from './utils';
import { calcPageSize } from './calcPageSize';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const isToggleModifier = event => !!(event && (event.metaKey || event.ctrlKey));
const isRangeModifier = event => !!(event && event.shiftKey);
/** 移动端不触发 dblclick，用两次点击间隔模拟双击打开；分栏桌面同理（展开列会重挂载） */
const DOUBLE_TAP_MS = 500;

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
  entries: entriesProp,
  totalCount: totalCountProp,
  loadingIndexes,
  ready: readyProp,
  columnListings,
  onVisibleRangeChange,
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
  onRegisterFolder,
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
  /** 分栏：每一级选中的文件夹 path，展开路径 = [currentPath, ...columnSelection] */
  const [columnSelection, setColumnSelection] = useState([]);
  const [propertiesPanelClosed, setPropertiesPanelClosed] = useState(false);
  const [marqueeDragging, setMarqueeDragging] = useState(false);
  const marqueeSessionRef = useRef(null);
  const lastTapRef = useRef({ path: null, at: 0 });
  const selectedPathsRef = useRef(selectedPaths);
  const scrollRef = useRef(null);
  const selectionEntryCacheRef = useRef(new Map());
  selectedPathsRef.current = selectedPaths;

  const isAsyncMode = typeof onVisibleRangeChange === 'function' && totalCountProp != null;

  const index = useMemo(() => buildFileSystemIndex(items || []), [items]);
  const currentPath = history.stack[history.index] ?? '';
  const searchQuery = normalizeSearchQuery(searchInput);
  const isSearching = searchQuery.length > 0;

  const selectedEntries = useMemo(() => {
    const cache = selectionEntryCacheRef.current;
    const resolved = selectedPaths.map(path => {
      const fromIndex = index.files.get(path) || index.folders.get(path);
      if (fromIndex) {
        cache.set(path, fromIndex);
        return fromIndex;
      }
      const fromEntries = (entriesProp || []).find(entry => entry && entry.path === path);
      if (fromEntries) {
        cache.set(path, fromEntries);
        return fromEntries;
      }
      // 异步稀疏列表滚动后选中项可能暂时不在当前页，用缓存保持属性面板
      return cache.get(path) || null;
    });
    // 清理已取消选中的缓存
    Array.from(cache.keys()).forEach(path => {
      if (!selectedPaths.includes(path)) {
        cache.delete(path);
      }
    });
    return resolved.filter(Boolean);
  }, [entriesProp, index, selectedPaths]);

  const staticCurrentEntries = useMemo(() => {
    const list = index.children.get(currentPath) || [];
    if (!isSearching) {
      return list;
    }
    return list.filter(entry => entry.path.slice(currentPath.length).toLowerCase().includes(searchQuery));
  }, [currentPath, index, isSearching, searchQuery]);

  const currentEntries = isAsyncMode ? entriesProp || [] : staticCurrentEntries;
  const displayCount = isAsyncMode ? totalCountProp : currentEntries.filter(Boolean).length;
  const rangeTotalCount = isAsyncMode ? totalCountProp : undefined;

  const nestedEntries = useMemo(() => buildNestedEntries(index), [index]);

  // 分栏列父路径：当前目录 + 每一级选中的文件夹（横向列数有限，只做纵向虚拟滚动）
  const columnPaths = useMemo(() => {
    const root = normalizeFolderPath(currentPath) || '';
    const chain = [];
    columnSelection.forEach(path => {
      const normalized = normalizeFolderPath(path) || '';
      if (!normalized || normalized === root) {
        return;
      }
      if (root && !(normalized === root || normalized.startsWith(root))) {
        return;
      }
      chain.push(normalized);
    });
    return [root, ...chain];
  }, [columnSelection, currentPath]);

  // 进入目录后清空分栏展开
  useEffect(() => {
    setColumnSelection(previous => (previous.length === 0 ? previous : []));
  }, [currentPath]);

  const emitSelectionChange = useCallback(
    paths => {
      const byPath = new Map();
      paths.forEach(path => {
        const fromIndex = index.files.get(path) || index.folders.get(path);
        if (fromIndex) {
          byPath.set(path, fromIndex);
          return;
        }
        const fromEntries = (entriesProp || []).find(entry => entry && entry.path === path);
        if (fromEntries) {
          byPath.set(path, fromEntries);
        }
      });
      onSelectionChange?.(paths.map(path => byPath.get(path)).filter(Boolean));
    },
    [entriesProp, index, onSelectionChange]
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
    // 已有选中（含滚动后暂时不在已加载页中的项）时不要覆盖
    if (selectedPathsRef.current.length > 0) {
      return;
    }
    const loaded = (currentEntries || []).filter(Boolean);
    if (loaded.length === 0) {
      return;
    }
    const firstPath = loaded[0].path;
    setSelectedPaths([firstPath]);
    setSelectionAnchorPath(firstPath);
    emitSelectionChange([firstPath]);
  }, [view, currentPath, currentEntries, emitSelectionChange]);

  const resolveSelectableEntries = useCallback(
    entry => {
      if (!entry) {
        return (currentEntries || []).filter(Boolean);
      }
      const parentPath = normalizeFolderPath(entry.parentPath != null ? entry.parentPath : pathParent(entry.path || '')) || '';

      // 分栏：按所在列（父路径）取兄弟节点，避免第二列 Shift 误用 currentPath 列表
      if (columnListings && Object.prototype.hasOwnProperty.call(columnListings, parentPath)) {
        const list = (columnListings[parentPath].entries || []).filter(Boolean);
        if (list.length > 0) {
          return list;
        }
      }

      if (parentPath === (currentPath || '')) {
        const list = (currentEntries || []).filter(Boolean);
        if (list.length > 0) {
          return list;
        }
      }

      const fromIndex = index.children.get(parentPath) || [];
      if (fromIndex.length > 0) {
        return fromIndex;
      }

      return (currentEntries || []).filter(Boolean);
    },
    [columnListings, currentEntries, currentPath, index]
  );

  const selectEntry = useCallback(
    (entry, event) => {
      const path = entry?.path ?? null;
      if (!path) {
        return;
      }
      if (entry) {
        selectionEntryCacheRef.current.set(path, entry);
      }

      let nextPaths;
      let nextAnchor = path;
      const selectable = resolveSelectableEntries(entry);

      if (isRangeModifier(event) && selectionAnchorPath) {
        const anchorIndex = selectable.findIndex(item => item.path === selectionAnchorPath);
        const targetIndex = selectable.findIndex(item => item.path === path);

        if (anchorIndex >= 0 && targetIndex >= 0) {
          const [start, end] = anchorIndex < targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
          nextPaths = selectable.slice(start, end + 1).map(item => item.path);
          nextPaths.forEach(p => {
            const item = selectable.find(e => e.path === p);
            if (item) {
              selectionEntryCacheRef.current.set(p, item);
            }
          });
          nextAnchor = selectionAnchorPath;
        } else {
          // 锚点不在同一列：退化为单选
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
    [emitSelectionChange, resolveSelectableEntries, selectedPaths, selectionAnchorPath]
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
      setColumnSelection([]);
      onPathChange?.(path);
    },
    [clearSelection, onPathChange]
  );

  /** 分栏单击文件夹：记录该级选中项并展开下一列（不进入目录） */
  const handleNavigateColumn = useCallback(
    (entryOrPath, columnIndex = 0) => {
      const entry = entryOrPath && typeof entryOrPath === 'object' ? entryOrPath : null;
      const path = entry ? entry.path : entryOrPath;
      const id = entry ? entry.id : undefined;
      if (!path || (entry && entry.kind !== 'folder')) {
        return;
      }
      if (id != null) {
        onRegisterFolder?.(path, id);
      }
      const folderPath = normalizeFolderPath(path);
      setColumnSelection(previous => [...previous.slice(0, columnIndex), folderPath]);
    },
    [onRegisterFolder]
  );

  /** 退回上一级文件夹（非浏览历史） */
  const goUp = useCallback(() => {
    if (!currentPath) {
      return;
    }
    navigateTo(pathParent(currentPath));
  }, [currentPath, navigateTo]);

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
  const canGoUp = !!currentPath;

  // 分栏单击展开时 currentPath 仍是导航路径；上传应落到正在浏览的最深目录
  const uploadPath = view === 'columns' && columnSelection.length > 0 ? columnSelection[columnSelection.length - 1] : currentPath;

  const fileSystemContextValue = useMemo(
    () => ({
      currentPath,
      uploadPath
    }),
    [currentPath, uploadPath]
  );

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

  const handleVisibleRangeChange = useCallback(
    range => {
      // 分栏：真正要拉的目录是 columnPath；其它视图等于 currentPath
      const listPath = range?.columnPath != null ? range.columnPath : currentPath;
      onVisibleRangeChange?.(
        Object.assign({}, range, {
          currentPath,
          path: listPath,
          keyword: searchQuery
        })
      );
    },
    [currentPath, onVisibleRangeChange, searchQuery]
  );

  // 换目录 / 搜索词时强制重新 emit 可视范围（不要依赖 callback 身份，避免 setState 死循环）
  const rangeRequestKey = `${currentPath}|${searchQuery}`;

  const renderContent = () => {
    const isLoadingSparse = isAsyncMode && displayCount === 0 && loadingIndexes && loadingIndexes.size > 0;
    // ready === false：首屏尚未确认，继续挂虚拟列表以测量视口；ready 未传时保持旧逻辑
    const isAsyncBootstrapping = isAsyncMode && displayCount === 0 && readyProp === false && !isLoadingSparse;

    if (displayCount === 0 && !isLoadingSparse && !isAsyncBootstrapping) {
      // 分栏展开中即使当前目录 total 暂时为 0，也继续挂列，避免整页被 Empty 换掉
      if (!(view === 'columns' && columnPaths.length > 0)) {
        if (isAsyncMode && totalCountProp === 0) {
          return (
            <div className={style['empty-wrap']}>
              <Empty description={isSearching ? formatMessage({ id: 'FileSystem.notFound' }, { keyword: searchInput.trim() }) : formatMessage({ id: 'FileSystem.emptyFolder' })} />
            </div>
          );
        }
        return (
          <div className={style['empty-wrap']}>
            <Empty description={isSearching ? formatMessage({ id: 'FileSystem.notFound' }, { keyword: searchInput.trim() }) : formatMessage({ id: 'FileSystem.emptyFolder' })} />
          </div>
        );
      }
    }

    // 异步分页模式才启用虚拟滚动；静态 items 走普通渲染
    if (isAsyncMode) {
      if (view === 'icons') {
        return (
          <VirtualIconsView
            entries={currentEntries}
            totalCount={rangeTotalCount}
            selectedPaths={selectedPaths}
            onSelect={handleEntryClick}
            onOpen={handleEntryDoubleClick}
            resolveStatus={resolveStatus}
            loadingIndexes={loadingIndexes}
            requestKey={rangeRequestKey}
            onVisibleRangeChange={handleVisibleRangeChange}
          />
        );
      }

      if (view === 'list') {
        return (
          <VirtualListTableView
            columns={columns}
            entries={currentEntries}
            totalCount={rangeTotalCount}
            selectedPaths={selectedPaths}
            onSelect={handleEntryClick}
            onOpen={handleEntryDoubleClick}
            resolveStatus={resolveStatus}
            loadingIndexes={loadingIndexes}
            requestKey={rangeRequestKey}
            onVisibleRangeChange={handleVisibleRangeChange}
          />
        );
      }

      if (view === 'columns') {
        return (
          <VirtualColumnsView
            columnPaths={columnPaths}
            entries={currentEntries}
            totalCount={rangeTotalCount}
            currentPath={currentPath}
            columnListings={columnListings}
            selectedPaths={selectedPaths}
            onSelect={selectEntry}
            onOpen={openEntry}
            onNavigateColumn={handleNavigateColumn}
            resolveStatus={resolveStatus}
            isMobile={isMobile}
            lastTapRef={lastTapRef}
            loadingIndexes={loadingIndexes}
            requestKey={rangeRequestKey}
            onVisibleRangeChange={handleVisibleRangeChange}
          />
        );
      }

      return (
        <VirtualGalleryView
          entries={currentEntries}
          totalCount={rangeTotalCount}
          selectedPaths={selectedPaths}
          onSelect={handleEntryClick}
          onOpen={handleEntryDoubleClick}
          renderFilePreview={renderFilePreview}
          canPreviewFile={canPreviewFile}
          formatMessage={formatMessage}
          resolveStatus={resolveStatus}
          loadingIndexes={loadingIndexes}
          requestKey={rangeRequestKey}
          onVisibleRangeChange={handleVisibleRangeChange}
        />
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
          onNavigateColumn={handleNavigateColumn}
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
  // 分栏/画廊：列内与侧栏滚动条易被框选误判为空点击，关闭框选（仍可用修饰键多选）
  const marqueeEnabled = !isMobile && (view === 'icons' || (view === 'list' && (isSearching || isAsyncMode)));

  return (
    <FileSystemContext.Provider value={fileSystemContextValue}>
      <div className={classnames(style.root, className)}>
        <div className={style.toolbar}>
          <Input allowClear size="small" className={style['search-input']} placeholder={formatMessage({ id: 'FileSystem.search' })} prefix={<SearchOutlined />} value={searchInput} onChange={event => setSearchInput(event.target.value)} />
          <div className={style['toolbar-nav']}>
            <Button type="text" size="small" icon={<ArrowLeftOutlined />} disabled={!canGoUp} onClick={goUp} title={formatMessage({ id: 'FileSystem.goUp' })} />
          </div>
          <div className={style['toolbar-title']} title={currentFolderName}>
            {currentFolderName}
          </div>
          {toolbarExtra ? <div className={style['toolbar-extra']}>{typeof toolbarExtra === 'function' ? toolbarExtra({ selectedEntries, clearSelection, currentPath, uploadPath }) : toolbarExtra}</div> : null}
          <Segmented size="small" className={style['view-switch']} value={view} onChange={setView} options={segmentedOptions} />
        </div>
        <div className={style.main}>
          <div className={style.content}>
            <MarqueeSelect enabled={marqueeEnabled} className={isAsyncMode || view === 'gallery' || view === 'columns' ? style['marquee-fill'] : undefined} onMarqueeSelect={handleMarqueeSelect} onEmptyClick={handleEmptyClick}>
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
            {displayCount} {isSearching ? formatMessage({ id: 'FileSystem.resultCount' }) : formatMessage({ id: 'FileSystem.itemCount' })}
          </span>
          {footerSelection}
        </div>
      </div>
    </FileSystemContext.Provider>
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
      {columnPaths.map((path, columnIndex) => {
        const entries = index.children.get(path) || [];

        return (
          <div key={path || 'root'} className={style.column}>
            {entries.map(entry => (
              <div
                key={entry.path}
                data-fs-path={entry.path}
                className={classnames(style['column-item'], selectedPaths.includes(entry.path) && style.selected)}
                onClick={event => {
                  if (!isMobile && event.detail > 1) {
                    return;
                  }
                  if (isMobile && isMobileDoubleTap(lastTapRef, entry.path)) {
                    onOpen(entry);
                    return;
                  }
                  onSelect(entry, event);
                  if (entry.kind === 'folder') {
                    onNavigateColumn(entry, columnIndex);
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

const FileSystem = withLocale(FileSystemInner);

FileSystem.PropertiesPanel = PropertiesPanel;
FileSystem.calcPageSize = calcPageSize;

export { FileSystemInner, PropertiesPanel, calcPageSize };
export default FileSystem;
