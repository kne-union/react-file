import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Empty, Table } from 'antd';
import { useVirtualizer } from '@tanstack/react-virtual';
import classnames from 'classnames';
import style from './FileSystem.module.scss';
import EntryIcon from './EntryIcon';
import { formatByteSize } from './utils';
import {
  COLUMN_ITEM_HEIGHT,
  GALLERY_FILM_ITEM_HEIGHT,
  GALLERY_FILM_STRIDE,
  ICONS_CELL_WIDTH,
  ICONS_ITEM_HEIGHT,
  ICONS_PADDING,
  ICONS_PADDING_X,
  ICONS_ROW_STRIDE,
  LIST_CONTENT_INLINE_PAD,
  LIST_PADDING_BOTTOM,
  LIST_PADDING_LEFT,
  LIST_PADDING_RIGHT,
  LIST_PADDING_TOP,
  LIST_ROW_HEIGHT,
  LIST_ROW_STRIDE,
  LIST_SWITCHER_WIDTH,
  calcPageSize
} from './calcPageSize';

const useElementSize = elementRef => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = elementRef?.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      setSize(previous => (previous.width === width && previous.height === height ? previous : { width, height }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [elementRef]);

  return size;
};

/**
 * 视口宽度变化（如属性面板开关）时，按选中项点击时的视口内偏移回滚 scrollTop，
 * 避免网格列数变化后选中项跳出视野。
 */
const usePreserveAnchorOnResize = ({ scrollRef, getItemOffset, itemSize, layoutKey }) => {
  const anchorRef = useRef(null);
  const getItemOffsetRef = useRef(getItemOffset);
  const layoutKeyRef = useRef(layoutKey);
  const itemSizeRef = useRef(itemSize);
  getItemOffsetRef.current = getItemOffset;
  layoutKeyRef.current = layoutKey;
  itemSizeRef.current = itemSize;

  const restoreAnchor = useCallback(() => {
    const el = scrollRef.current;
    const anchor = anchorRef.current;
    if (!el || !anchor || anchor.index < 0) {
      return;
    }
    const width = el.clientWidth;
    const nextLayoutKey = layoutKeyRef.current;
    const widthChanged = Math.abs(anchor.width - width) > 1;
    const layoutChanged = anchor.layoutKey !== nextLayoutKey;
    if (!widthChanged && !layoutChanged) {
      return;
    }

    const itemTop = getItemOffsetRef.current(anchor.index);
    const size = itemSizeRef.current;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    let nextScroll = itemTop - anchor.offsetFromTop;
    nextScroll = Math.max(0, Math.min(nextScroll, maxScroll));
    el.scrollTop = nextScroll;

    if (itemTop < el.scrollTop) {
      el.scrollTop = Math.max(0, Math.min(itemTop, maxScroll));
    } else if (itemTop + size > el.scrollTop + el.clientHeight) {
      el.scrollTop = Math.max(0, Math.min(itemTop + size - el.clientHeight, maxScroll));
    }

    anchorRef.current = {
      index: anchor.index,
      offsetFromTop: itemTop - el.scrollTop,
      width: el.clientWidth,
      layoutKey: nextLayoutKey
    };
  }, [scrollRef]);

  const captureAnchor = useCallback(
    (index, event) => {
      const el = scrollRef.current;
      const target = event?.currentTarget;
      if (!el || index == null || index < 0) {
        return;
      }
      let offsetFromTop;
      if (target && typeof target.getBoundingClientRect === 'function') {
        const itemRect = target.getBoundingClientRect();
        const parentRect = el.getBoundingClientRect();
        offsetFromTop = itemRect.top - parentRect.top;
      } else {
        offsetFromTop = getItemOffsetRef.current(index) - el.scrollTop;
      }
      anchorRef.current = {
        index,
        offsetFromTop,
        width: el.clientWidth,
        layoutKey: layoutKeyRef.current
      };
    },
    [scrollRef]
  );

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => {
      restoreAnchor();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [restoreAnchor, scrollRef]);

  // 列数等布局 key 变化时（宽度状态可能尚未同步）再校正一次
  useLayoutEffect(() => {
    restoreAnchor();
  }, [layoutKey, restoreAnchor]);

  return captureAnchor;
};

const useEmitVisibleRange = ({ enabled, startIndex, endIndex, view, viewport, onVisibleRangeChange, pageSize, requestKey = '' }) => {
  const lastKeyRef = useRef('');
  const cbRef = useRef(onVisibleRangeChange);
  cbRef.current = onVisibleRangeChange;

  useEffect(() => {
    if (!enabled || typeof cbRef.current !== 'function') {
      return;
    }
    // 视口未测到真实尺寸前不回调，避免用 fallback pageSize 拉页后再因尺寸变化反复重置
    if (!(viewport.width > 0 && viewport.height > 0)) {
      return;
    }
    const safeStart = Math.max(0, startIndex);
    const safeEnd = endIndex < 0 ? Math.max(0, pageSize - 1) : endIndex;
    // 用 requestKey（路径/keyword/列）去重；不要用 callback 身份，否则 setState 后必再触发死循环
    const key = `${requestKey}:${view}:${safeStart}:${safeEnd}:${pageSize}`;
    if (key === lastKeyRef.current) {
      return;
    }
    lastKeyRef.current = key;
    cbRef.current({
      startIndex: safeStart,
      endIndex: safeEnd,
      view,
      viewport,
      pageSize
    });
  }, [enabled, endIndex, pageSize, requestKey, startIndex, view, viewport.height, viewport.width]);
};

const EntrySkeleton = ({ variant = 'icons' }) => {
  if (variant === 'inline') {
    return (
      <div className={style['entry-skeleton-inline']}>
        <span className={style['entry-skeleton-icon-sm']} />
        <span className={style['entry-skeleton-name-inline']} />
      </div>
    );
  }

  return (
    <div className={classnames(style['icon-item'], style['entry-skeleton-icons'])}>
      <span className={style['entry-skeleton-icon']} />
      <span className={style['entry-skeleton-name']} />
    </div>
  );
};

const toLoadingSet = loadingIndexes => {
  if (loadingIndexes instanceof Set) {
    return loadingIndexes;
  }
  if (Array.isArray(loadingIndexes) || loadingIndexes instanceof Map) {
    return new Set(loadingIndexes);
  }
  return new Set();
};

/** 仅在真正请求中的下标显示骨架；total=0 时用 loading 下标撑起首屏占位 */
const resolveVirtualCount = (totalCount, entries, loadingSet) => {
  const base = totalCount != null ? totalCount : entries?.length || 0;
  if (!loadingSet.size) {
    return Math.max(0, base);
  }
  let loadingMax = 0;
  loadingSet.forEach(index => {
    if (index + 1 > loadingMax) {
      loadingMax = index + 1;
    }
  });
  return Math.max(0, base, loadingMax);
};

export const IconsView = ({ entries, totalCount, selectedPaths, onSelect, onOpen, resolveStatus, loadingIndexes, onVisibleRangeChange, requestKey = '' }) => {
  const parentRef = useRef(null);
  const loadingSet = toLoadingSet(loadingIndexes);
  const count = resolveVirtualCount(totalCount, entries, loadingSet);
  const viewport = useElementSize(parentRef);
  const measured = viewport.width > 0 && viewport.height > 0;
  const cols = Math.max(1, Math.floor((Math.max(viewport.width || 400, ICONS_CELL_WIDTH) - ICONS_PADDING_X) / ICONS_CELL_WIDTH));
  const rowCount = Math.max(count === 0 ? 0 : 1, Math.ceil(count / cols));
  const pageSize = calcPageSize({
    view: 'icons',
    width: measured ? viewport.width : 400,
    height: measured ? viewport.height : 400
  });

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ICONS_ROW_STRIDE,
    overscan: 3
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const startIndex = virtualRows.length ? virtualRows[0].index * cols : 0;
  const endIndex = virtualRows.length ? Math.min(count - 1, (virtualRows[virtualRows.length - 1].index + 1) * cols - 1) : -1;

  const getItemOffset = useCallback(index => Math.floor(index / cols) * ICONS_ROW_STRIDE + ICONS_PADDING, [cols]);
  const captureAnchor = usePreserveAnchorOnResize({
    scrollRef: parentRef,
    getItemOffset,
    itemSize: ICONS_ITEM_HEIGHT,
    layoutKey: cols
  });

  useEmitVisibleRange({
    enabled: measured,
    startIndex,
    endIndex,
    view: 'icons',
    viewport,
    pageSize,
    requestKey,
    onVisibleRangeChange
  });

  return (
    <div ref={parentRef} className={style['virtual-scroll']}>
      {count === 0 ? null : (
        <div
          className={style['icons-virtual']}
          style={{
            height: Math.max(rowVirtualizer.getTotalSize(), ICONS_ROW_STRIDE) + ICONS_PADDING * 2,
            position: 'relative'
          }}
        >
          {(virtualRows.length ? virtualRows : [{ key: 'fallback', index: 0, start: 0, size: ICONS_ROW_STRIDE }]).map(virtualRow => {
            const rowIndex = virtualRow.index;
            const cells = [];
            for (let col = 0; col < cols; col += 1) {
              const index = rowIndex * cols + col;
              if (index >= count) {
                break;
              }
              const entry = entries[index];
              cells.push(
                entry ? (
                  <div
                    key={entry.path || entry.id || index}
                    data-fs-path={entry.path}
                    data-fs-index={index}
                    className={classnames(style['icon-item'], selectedPaths.includes(entry.path) && style.selected)}
                    onClick={event => {
                      captureAnchor(index, event);
                      onSelect(entry, event);
                    }}
                    onDoubleClick={() => onOpen(entry)}
                  >
                    <EntryIcon entry={entry} size="lg" status={resolveStatus?.(entry)} />
                    <span className={style['icon-label']} title={entry.name}>
                      {entry.name}
                    </span>
                  </div>
                ) : loadingSet.has(index) ? (
                  <EntrySkeleton key={`sk-${index}`} />
                ) : (
                  <div key={`empty-${index}`} className={style['icon-item']} aria-hidden />
                )
              );
            }

            return (
              <div
                key={virtualRow.key}
                className={style['icons-virtual-row']}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: ICONS_PADDING,
                  width: `calc(100% - ${ICONS_PADDING_X}px)`,
                  height: ICONS_ITEM_HEIGHT,
                  transform: `translateY(${virtualRow.start + ICONS_PADDING}px)`,
                  gridTemplateColumns: `repeat(${cols}, 96px)`
                }}
              >
                {cells}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ListTableView = ({ columns, entries, totalCount, selectedPaths, onSelect, onOpen, resolveStatus, loadingIndexes, onVisibleRangeChange, requestKey = '' }) => {
  const parentRef = useRef(null);
  const loadingSet = toLoadingSet(loadingIndexes);
  const count = resolveVirtualCount(totalCount, entries, loadingSet);
  const viewport = useElementSize(parentRef);
  const measured = viewport.width > 0 && viewport.height > 0;
  const pageSize = calcPageSize({
    view: 'list',
    width: measured ? viewport.width : 400,
    height: measured ? viewport.height : 400
  });

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LIST_ROW_STRIDE,
    overscan: 8
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const startIndex = virtualRows.length ? virtualRows[0].index : 0;
  const endIndex = virtualRows.length ? virtualRows[virtualRows.length - 1].index : -1;

  useEmitVisibleRange({
    enabled: measured,
    startIndex,
    endIndex,
    view: 'list',
    viewport,
    pageSize,
    requestKey,
    onVisibleRangeChange
  });

  const getItemOffset = useCallback(index => index * LIST_ROW_STRIDE + LIST_PADDING_TOP, []);
  const captureAnchor = usePreserveAnchorOnResize({
    scrollRef: parentRef,
    getItemOffset,
    itemSize: LIST_ROW_STRIDE,
    layoutKey: 'list'
  });

  // 非异步小列表仍用 antd Table（与搜索列表一致）
  const useNativeTable = totalCount == null && count <= 80;

  if (useNativeTable) {
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
  }

  const rows =
    count === 0
      ? []
      : virtualRows.length
        ? virtualRows
        : Array.from({ length: Math.min(count, 20) }, (_, index) => ({
            key: `fallback-${index}`,
            index,
            start: index * LIST_ROW_STRIDE,
            size: LIST_ROW_STRIDE
          }));

  const listPaddingX = LIST_PADDING_LEFT + LIST_PADDING_RIGHT;
  const rowInlinePadLeft = LIST_SWITCHER_WIDTH + LIST_CONTENT_INLINE_PAD;

  // 异步虚拟列表：行高/间距/内边距对齐非虚拟 Tree（.tree-wrap）
  return (
    <div ref={parentRef} className={classnames(style['virtual-scroll'], style['list-virtual-tree'])}>
      <div
        className={style['list-virtual-body']}
        style={{
          height: Math.max(rowVirtualizer.getTotalSize(), LIST_ROW_STRIDE) + LIST_PADDING_TOP + LIST_PADDING_BOTTOM,
          position: 'relative'
        }}
      >
        {rows.map(virtualRow => {
          const index = virtualRow.index;
          const entry = entries[index];
          return (
            <div
              key={virtualRow.key}
              className={classnames(style['list-tree-row'], entry && selectedPaths.includes(entry.path) && style.selected)}
              data-fs-path={entry?.path}
              data-fs-index={index}
              style={{
                position: 'absolute',
                top: 0,
                left: LIST_PADDING_LEFT,
                width: `calc(100% - ${listPaddingX}px)`,
                height: LIST_ROW_HEIGHT,
                paddingLeft: rowInlinePadLeft,
                paddingRight: LIST_CONTENT_INLINE_PAD,
                transform: `translateY(${virtualRow.start + LIST_PADDING_TOP}px)`
              }}
              onClick={
                entry
                  ? event => {
                      captureAnchor(index, event);
                      onSelect(entry, event);
                    }
                  : undefined
              }
              onDoubleClick={entry ? () => onOpen(entry) : undefined}
            >
              {entry ? (
                <>
                  <span className={style['list-tree-icon']}>
                    <EntryIcon entry={entry} size="sm" status={resolveStatus?.(entry)} />
                  </span>
                  <span className={style['list-tree-title']} title={entry.name}>
                    {entry.name}
                  </span>
                </>
              ) : loadingSet.has(index) ? (
                <EntrySkeleton variant="inline" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 分栏 = 有限横向列，每列各自纵向虚拟滚动。
 * columnPaths[i] = 第 i 列父目录；单击展开只追加右侧列，左侧列数据不应被改写。
 */
export const ColumnsView = ({
  columnPaths,
  entries,
  totalCount,
  currentPath,
  columnListings,
  selectedPaths,
  onSelect,
  onOpen,
  onNavigateColumn,
  resolveStatus,
  isMobile,
  lastTapRef,
  loadingIndexes,
  onVisibleRangeChange,
  requestKey = ''
}) => {
  const asyncMode = totalCount != null || columnListings != null;
  // 某列曾渲染出真实条目后，若被误写成空，用缓存顶住（不挡 !ready 时的分页请求）
  const lastGoodRef = useRef({});

  return (
    <div className={style['columns-wrap']}>
      {columnPaths.map((path, columnIndex) => {
        const pathKey = path || '';
        const listing = columnListings ? columnListings[pathKey] : null;
        const isCurrent = pathKey === (currentPath || '');

        let columnEntries;
        let count;
        let columnLoading;

        if (listing) {
          columnEntries = listing.entries || [];
          count = listing.totalCount != null ? listing.totalCount : columnEntries.length;
          columnLoading = listing.loadingIndexes;
        } else if (isCurrent) {
          columnEntries = entries || [];
          count = totalCount != null ? totalCount : columnEntries.length;
          columnLoading = loadingIndexes;
        } else {
          // 新展开列：尚无 listing，count=0 触发首屏拉取
          columnEntries = [];
          count = 0;
          columnLoading = undefined;
        }

        const hasRealItems = (columnEntries || []).some(Boolean);
        if (hasRealItems) {
          lastGoodRef.current[pathKey] = { entries: columnEntries, count };
        } else if (count === 0 && lastGoodRef.current[pathKey]?.count > 0) {
          const cached = lastGoodRef.current[pathKey];
          columnEntries = cached.entries;
          count = cached.count;
        }

        return (
          <ColumnPane
            key={pathKey || 'root'}
            columnPath={pathKey}
            columnIndex={columnIndex}
            entries={columnEntries}
            count={Math.max(0, count)}
            selectedPaths={selectedPaths}
            onSelect={onSelect}
            onOpen={onOpen}
            onNavigateColumn={onNavigateColumn}
            resolveStatus={resolveStatus}
            isMobile={isMobile}
            lastTapRef={lastTapRef}
            loadingIndexes={columnLoading}
            onVisibleRangeChange={asyncMode ? onVisibleRangeChange : undefined}
            emitRange={!!asyncMode}
            requestKey={`${requestKey}|${pathKey}`}
          />
        );
      })}
    </div>
  );
};

const ColumnPane = ({ columnPath, columnIndex, entries, count, selectedPaths, onSelect, onOpen, onNavigateColumn, resolveStatus, isMobile, lastTapRef, loadingIndexes, onVisibleRangeChange, emitRange, requestKey = '' }) => {
  const parentRef = useRef(null);
  const loadingSet = toLoadingSet(loadingIndexes);
  const viewport = useElementSize(parentRef);
  const measured = viewport.width > 0 && viewport.height > 0;
  const pageSize = calcPageSize({
    view: 'columns',
    width: measured ? viewport.width : 220,
    height: measured ? viewport.height : 400
  });

  const rowVirtualizer = useVirtualizer({
    count: Math.max(0, resolveVirtualCount(count, entries, loadingSet)),
    getScrollElement: () => parentRef.current,
    estimateSize: () => COLUMN_ITEM_HEIGHT,
    overscan: 8
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const startIndex = virtualRows.length ? virtualRows[0].index : 0;
  const endIndex = virtualRows.length ? virtualRows[virtualRows.length - 1].index : -1;

  const emitVisibleRange = useCallback(
    range => {
      onVisibleRangeChange?.(
        Object.assign({}, range, {
          columnPath: columnPath || ''
        })
      );
    },
    [columnPath, onVisibleRangeChange]
  );

  useEmitVisibleRange({
    enabled: !!emitRange && measured,
    startIndex,
    endIndex,
    view: 'columns',
    viewport,
    pageSize,
    requestKey,
    onVisibleRangeChange: emitVisibleRange
  });

  const rows = virtualRows.length
    ? virtualRows
    : count > 0
      ? Array.from({ length: Math.min(count, 30) }, (_, index) => ({
          key: `fallback-${index}`,
          index,
          start: index * COLUMN_ITEM_HEIGHT,
          size: COLUMN_ITEM_HEIGHT
        }))
      : [];

  return (
    <div className={style.column} ref={parentRef}>
      <div style={{ height: Math.max(rowVirtualizer.getTotalSize(), rows.length * COLUMN_ITEM_HEIGHT, COLUMN_ITEM_HEIGHT), position: 'relative', width: '100%' }}>
        {rows.map(virtualRow => {
          const entry = entries[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-fs-path={entry?.path}
              data-fs-index={virtualRow.index}
              className={classnames(style['column-item'], entry && selectedPaths.includes(entry.path) && style.selected)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`
              }}
              onClick={
                entry
                  ? event => {
                      if (!isMobile && event.detail > 1) {
                        return;
                      }
                      if (isMobile && lastTapRef) {
                        const now = Date.now();
                        const last = lastTapRef.current || {};
                        if (last.path === entry.path && now - last.at <= 500) {
                          lastTapRef.current = { path: null, at: 0 };
                          onOpen(entry);
                          return;
                        }
                        lastTapRef.current = { path: entry.path, at: now };
                      }
                      onSelect(entry, event);
                      if (entry.kind === 'folder') {
                        onNavigateColumn(entry, columnIndex);
                      }
                    }
                  : undefined
              }
              onDoubleClick={
                entry && !isMobile
                  ? () => {
                      onOpen(entry);
                    }
                  : undefined
              }
            >
              {entry ? (
                <>
                  <EntryIcon entry={entry} size="sm" status={resolveStatus?.(entry)} />
                  <span className={style['column-name']} title={entry.name}>
                    {entry.name}
                  </span>
                  {entry.kind === 'file' ? <span className={style['column-meta']}>{formatByteSize(entry.size)}</span> : null}
                </>
              ) : loadingSet.has(virtualRow.index) ? (
                <EntrySkeleton variant="inline" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GalleryView = ({ entries, totalCount, selectedPaths, onSelect, onOpen, renderFilePreview, canPreviewFile, formatMessage, resolveStatus, loadingIndexes, onVisibleRangeChange, requestKey = '' }) => {
  const filmstripRef = useRef(null);
  const loadingSet = toLoadingSet(loadingIndexes);
  const count = resolveVirtualCount(totalCount, entries, loadingSet);
  const viewport = useElementSize(filmstripRef);
  const measured = viewport.width > 0 && viewport.height > 0;
  const pageSize = calcPageSize({
    view: 'gallery',
    width: measured ? viewport.width : 280,
    height: measured ? viewport.height : 400
  });

  const primaryPath = selectedPaths[selectedPaths.length - 1];
  const selectedEntryCacheRef = useRef(null);
  const selectedEntry = useMemo(() => {
    if (primaryPath) {
      const found = entries.find(entry => entry && entry.path === primaryPath);
      if (found) {
        selectedEntryCacheRef.current = found;
        return found;
      }
      if (selectedEntryCacheRef.current?.path === primaryPath) {
        return selectedEntryCacheRef.current;
      }
      return selectedEntryCacheRef.current;
    }
    selectedEntryCacheRef.current = null;
    return null;
  }, [entries, primaryPath]);
  const activePath = primaryPath || selectedEntry?.path || null;

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => filmstripRef.current,
    estimateSize: () => GALLERY_FILM_STRIDE,
    overscan: 8
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const startIndex = virtualRows.length ? virtualRows[0].index : 0;
  const endIndex = virtualRows.length ? virtualRows[virtualRows.length - 1].index : -1;

  useEmitVisibleRange({
    enabled: measured,
    startIndex,
    endIndex,
    view: 'gallery',
    viewport,
    pageSize,
    requestKey,
    onVisibleRangeChange
  });

  useEffect(() => {
    if (!activePath) {
      return;
    }
    const index = entries.findIndex(entry => entry && entry.path === activePath);
    if (index >= 0) {
      rowVirtualizer.scrollToIndex(index, { align: 'auto' });
    }
    // 仅在选中变化时滚入视野；entries 分页更新时不要打断侧栏滚动
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
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

  const rows = virtualRows.length
    ? virtualRows
    : count > 0
      ? Array.from({ length: Math.min(count, 30) }, (_, index) => ({
          key: `fallback-${index}`,
          index,
          start: index * GALLERY_FILM_STRIDE,
          size: GALLERY_FILM_STRIDE
        }))
      : [];

  return (
    <div className={style.gallery}>
      <div className={style['gallery-stage']}>{renderStage()}</div>
      <div className={style['gallery-sidebar']}>
        <div className={style['gallery-sidebar-title']}>{formatMessage({ id: 'FileSystem.currentFolder' })}</div>
        <div className={style['gallery-filmstrip']} ref={filmstripRef}>
          <div
            style={{
              height: Math.max(rowVirtualizer.getTotalSize(), rows.length * GALLERY_FILM_STRIDE),
              position: 'relative',
              width: '100%'
            }}
          >
            {rows.map(virtualRow => {
              const entry = entries[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-fs-path={entry?.path}
                  data-fs-index={virtualRow.index}
                  className={classnames(style['gallery-film-item'], entry && entry.path === activePath && style.selected)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: GALLERY_FILM_ITEM_HEIGHT,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                  onClick={entry ? event => onSelect(entry, event) : undefined}
                  onDoubleClick={entry ? () => onOpen(entry) : undefined}
                >
                  {entry ? (
                    <>
                      <EntryIcon entry={entry} size="sm" status={resolveStatus?.(entry)} />
                      <span className={style['column-name']} title={entry.name}>
                        {entry.name}
                      </span>
                    </>
                  ) : loadingSet.has(virtualRow.index) ? (
                    <EntrySkeleton variant="inline" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { calcPageSize };
