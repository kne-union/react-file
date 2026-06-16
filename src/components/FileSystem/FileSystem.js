import { useCallback, useMemo, useState } from 'react';
import { Button, Empty, Input, Segmented, Table, Tree } from 'antd';
import { AppstoreOutlined, ArrowLeftOutlined, ArrowRightOutlined, ColumnWidthOutlined, PictureOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import style from './FileSystem.module.scss';
import EntryIcon from './EntryIcon';
import { buildFileSystemIndex, buildNestedEntries, formatByteSize, normalizeFolderPath, normalizeSearchQuery, pathName, pathParent } from './utils';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const FileSystemInner = ({ items, className, title = 'Files', defaultView = 'list', defaultPath = '', onSelectionChange, onFileOpen, renderFilePreview, canPreviewFile }) => {
  const { formatMessage } = useIntl();
  const [view, setView] = useState(defaultView);
  const [history, setHistory] = useState(() => ({
    index: 0,
    stack: [normalizeFolderPath(defaultPath)]
  }));
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [columnAnchorPath, setColumnAnchorPath] = useState('');

  const index = useMemo(() => buildFileSystemIndex(items), [items]);
  const currentPath = history.stack[history.index] ?? '';
  const searchQuery = normalizeSearchQuery(searchInput);
  const isSearching = searchQuery.length > 0;

  const selectedEntry = useMemo(() => {
    if (!selectedPath) return null;
    return index.files.get(selectedPath) || index.folders.get(selectedPath) || null;
  }, [index, selectedPath]);

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

  const selectEntry = useCallback(
    entry => {
      const path = entry?.path ?? null;
      setSelectedPath(path);
      onSelectionChange?.(entry);
    },
    [onSelectionChange]
  );

  const navigateTo = useCallback(folderPath => {
    const path = normalizeFolderPath(folderPath);
    setHistory(previous => {
      if (previous.stack[previous.index] === path) return previous;
      const stack = [...previous.stack.slice(0, previous.index + 1), path];
      return { index: stack.length - 1, stack };
    });
    setSearchInput('');
    setSelectedPath(null);
    setColumnAnchorPath(path);
  }, []);

  const goBack = useCallback(() => {
    setHistory(previous => ({
      ...previous,
      index: Math.max(0, previous.index - 1)
    }));
    setSearchInput('');
    setSelectedPath(null);
  }, []);

  const goForward = useCallback(() => {
    setHistory(previous => ({
      ...previous,
      index: Math.min(previous.stack.length - 1, previous.index + 1)
    }));
    setSearchInput('');
    setSelectedPath(null);
  }, []);

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

  const treeData = useMemo(() => {
    const renderTitle = entry => (
      <span className={classnames(entry.kind === 'folder' && style['list-name-folder'])}>
        {entry.name}
        {entry.kind === 'file' ? ` · ${formatByteSize(entry.size)}` : ''}
      </span>
    );

    const mapNode = entry => ({
      key: entry.path,
      entry,
      title: renderTitle(entry),
      icon: <EntryIcon entry={entry} size="sm" />,
      isLeaf: entry.kind === 'file',
      children: entry.children ? entry.children.map(mapNode) : undefined
    });

    return nestedEntries.map(mapNode);
  }, [nestedEntries]);

  const currentFolderName = currentPath === '' ? title : pathName(currentPath) || title;
  const canGoBack = history.index > 0;
  const canGoForward = history.index < history.stack.length - 1;

  const VIEW_OPTIONS = [
    { label: formatMessage({ id: 'FileSystem.viewGrid' }), value: 'icons', icon: <AppstoreOutlined /> },
    { label: formatMessage({ id: 'FileSystem.viewList' }), value: 'list', icon: <UnorderedListOutlined /> },
    { label: formatMessage({ id: 'FileSystem.viewColumns' }), value: 'columns', icon: <ColumnWidthOutlined /> },
    { label: formatMessage({ id: 'FileSystem.viewGallery' }), value: 'gallery', icon: <PictureOutlined /> }
  ];

  const columns = [
    {
      title: formatMessage({ id: 'FileSystem.columnName' }),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <span className={classnames(style['list-name'], record.kind === 'folder' && style['list-name-folder'])}>
          <EntryIcon entry={record} size="sm" />
          {record.name}
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
      return <IconsView entries={currentEntries} selectedPath={selectedPath} onSelect={selectEntry} onOpen={openEntry} />;
    }

    if (view === 'list') {
      if (isSearching) {
        return <ListTableView columns={columns} entries={currentEntries} selectedPath={selectedPath} onSelect={selectEntry} onOpen={openEntry} />;
      }

      return <ListView treeData={treeData} expandedKeys={expandedKeys} onExpand={setExpandedKeys} selectedPath={selectedPath} onSelect={selectEntry} onOpen={openEntry} />;
    }

    if (view === 'columns') {
      return <ColumnsView columnPaths={columnPaths} index={index} selectedPath={selectedPath} onSelect={selectEntry} onOpen={openEntry} onNavigateColumn={setColumnAnchorPath} />;
    }

    return (
      <GalleryView
        entries={currentEntries}
        selectedPath={selectedPath}
        onSelect={selectEntry}
        onOpen={openEntry}
        onNavigate={entry => navigateTo(entry.path)}
        renderFilePreview={renderFilePreview}
        canPreviewFile={canPreviewFile}
        formatMessage={formatMessage}
      />
    );
  };

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.toolbar}>
        <div className={style['toolbar-nav']}>
          <Button type="text" size="small" icon={<ArrowLeftOutlined />} disabled={!canGoBack} onClick={goBack} />
          <Button type="text" size="small" icon={<ArrowRightOutlined />} disabled={!canGoForward} onClick={goForward} />
        </div>
        <div className={style['toolbar-title']} title={currentFolderName}>
          {currentFolderName}
        </div>
        <div className={style['toolbar-actions']}>
          <Input allowClear size="small" className={style['search-input']} placeholder={formatMessage({ id: 'FileSystem.search' })} prefix={<SearchOutlined />} value={searchInput} onChange={event => setSearchInput(event.target.value)} />
          <Segmented
            size="small"
            value={view}
            onChange={setView}
            options={VIEW_OPTIONS.map(option => ({
              label: option.label,
              value: option.value,
              icon: option.icon
            }))}
          />
        </div>
      </div>
      <div className={style.content}>{renderContent()}</div>
      <div className={style.footer}>
        <span>
          {currentEntries.length} {isSearching ? formatMessage({ id: 'FileSystem.resultCount' }) : formatMessage({ id: 'FileSystem.itemCount' })}
        </span>
        {selectedEntry ? <span>· {formatMessage({ id: 'FileSystem.selected' }, { name: selectedEntry.name })}</span> : null}
      </div>
    </div>
  );
};

const IconsView = ({ entries, selectedPath, onSelect, onOpen }) => {
  return (
    <div className={style['icons-grid']}>
      {entries.map(entry => (
        <div key={entry.path} className={classnames(style['icon-item'], selectedPath === entry.path && style.selected)} onClick={() => onSelect(entry)} onDoubleClick={() => onOpen(entry)}>
          <EntryIcon entry={entry} size="lg" />
          <span className={style['icon-label']}>{entry.name}</span>
        </div>
      ))}
    </div>
  );
};

const ListView = ({ treeData, expandedKeys, onExpand, selectedPath, onSelect, onOpen }) => {
  const handleDoubleClick = useCallback(
    (_, node) => {
      const entry = node.entry;
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

  return (
    <div className={style['tree-wrap']}>
      <Tree showIcon blockNode treeData={treeData} expandedKeys={expandedKeys} selectedKeys={selectedPath ? [selectedPath] : []} onExpand={onExpand} onSelect={(_, info) => onSelect(info.node.entry)} onDoubleClick={handleDoubleClick} />
    </div>
  );
};

const ListTableView = ({ columns, entries, selectedPath, onSelect, onOpen }) => {
  return (
    <Table
      className={style['list-table']}
      size="small"
      pagination={false}
      rowKey="path"
      columns={columns}
      dataSource={entries}
      rowClassName={record => (record.path === selectedPath ? 'ant-table-row-selected' : '')}
      onRow={record => ({
        onClick: () => onSelect(record),
        onDoubleClick: () => onOpen(record)
      })}
    />
  );
};

const ColumnsView = ({ columnPaths, index, selectedPath, onSelect, onOpen, onNavigateColumn }) => {
  return (
    <div className={style['columns-wrap']}>
      {columnPaths.map(path => {
        const entries = index.children.get(path) || [];

        return (
          <div key={path || 'root'} className={style.column}>
            {entries.map(entry => (
              <div
                key={entry.path}
                className={classnames(style['column-item'], selectedPath === entry.path && style.selected)}
                onClick={() => {
                  onSelect(entry);
                  if (entry.kind === 'folder') {
                    onNavigateColumn(entry.path);
                  }
                }}
                onDoubleClick={() => onOpen(entry)}
              >
                <EntryIcon entry={entry} size="sm" />
                <span className={style['column-name']}>{entry.name}</span>
                {entry.kind === 'file' ? <span className={style['column-meta']}>{formatByteSize(entry.size)}</span> : null}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const GalleryView = ({ entries, selectedPath, onSelect, onOpen, onNavigate, renderFilePreview, canPreviewFile, formatMessage }) => {
  const selectedEntry = entries.find(entry => entry.path === selectedPath) || entries[0] || null;

  const handleItemClick = entry => {
    onSelect(entry);
    if (entry.kind === 'folder') {
      onNavigate?.(entry);
    }
  };

  const renderPlaceholder = entry => (
    <div className={style['gallery-preview']}>
      <EntryIcon entry={entry} size="xl" />
      <div className={style['gallery-name']}>{entry.name}</div>
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
        return <div className={style['gallery-stage-content']}>{preview}</div>;
      }
    }

    return renderPlaceholder(selectedEntry);
  };

  return (
    <div className={style.gallery}>
      <div className={style['gallery-stage']}>{renderStage()}</div>
      <div className={style['gallery-sidebar']}>
        <div className={style['gallery-sidebar-title']}>{formatMessage({ id: 'FileSystem.currentFolder' })}</div>
        <div className={style['gallery-filmstrip']}>
          {entries.map(entry => (
            <div
              key={entry.path}
              className={classnames(style['gallery-film-item'], selectedEntry?.path === entry.path && style.selected)}
              onClick={() => handleItemClick(entry)}
              onDoubleClick={() => {
                if (entry.kind === 'folder') {
                  onOpen(entry);
                }
              }}
            >
              <EntryIcon entry={entry} size="sm" />
              <span className={style['column-name']}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FileSystem = withLocale(FileSystemInner);

export { FileSystemInner };
export default FileSystem;
