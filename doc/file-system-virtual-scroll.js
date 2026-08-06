const { FileSystem, calcPageSize } = _ReactFile;
const { createWithRemoteLoader } = remoteLoader;
const { useCallback, useRef, useState } = React;

const FOLDER_COUNT = 40;
const FILE_COUNT = 960;
const NEST_FILE_COUNT = 12;

const pad = (n, width = 4) => String(n).padStart(width, '0');

/** 按 parentPath 索引的子节点（含多层） */
const childrenByPath = new Map();

const addChild = (parentPath, entry) => {
  const key = parentPath || '';
  if (!childrenByPath.has(key)) {
    childrenByPath.set(key, []);
  }
  childrenByPath.get(key).push(entry);
};

const folderItems = [];

const registerFolder = ({ id, path, name, parentId, parentPath }) => {
  const item = { kind: 'folder', path, name, id, parentId, parentPath };
  folderItems.push(item);
  addChild(parentPath || '', { ...item });
  return item;
};

registerFolder({ id: 'folder-bulk', path: 'bulk/', name: 'bulk', parentPath: '' });

for (let i = 0; i < FOLDER_COUNT; i += 1) {
  const n = pad(i + 1, 2);
  const folderId = `folder-${n}`;
  const folderPath = `bulk/folder-${n}/`;
  registerFolder({
    id: folderId,
    path: folderPath,
    name: `folder-${n}`,
    parentId: 'folder-bulk',
    parentPath: 'bulk/'
  });

  // 前 5 个文件夹挂二级 / 三级，方便测分栏
  if (i < 5) {
    for (let j = 1; j <= 3; j += 1) {
      const midId = `folder-${n}-mid-${j}`;
      const midPath = `${folderPath}mid-${j}/`;
      registerFolder({
        id: midId,
        path: midPath,
        name: `mid-${j}`,
        parentId: folderId,
        parentPath: folderPath
      });
      for (let k = 1; k <= 4; k += 1) {
        addChild(midPath, {
          kind: 'file',
          path: `${midPath}file-${k}.txt`,
          name: `file-${k}.txt`,
          id: `file-${n}-mid-${j}-${k}`,
          parentId: midId,
          parentPath: midPath,
          size: 2048 + k,
          mimetype: 'text/plain'
        });
      }
      if (j === 1) {
        const deepId = `folder-${n}-deep`;
        const deepPath = `${midPath}deep/`;
        registerFolder({
          id: deepId,
          path: deepPath,
          name: 'deep',
          parentId: midId,
          parentPath: midPath
        });
        for (let k = 1; k <= NEST_FILE_COUNT; k += 1) {
          addChild(deepPath, {
            kind: 'file',
            path: `${deepPath}deep-${pad(k, 2)}.txt`,
            name: `deep-${pad(k, 2)}.txt`,
            id: `file-${n}-deep-${k}`,
            parentId: deepId,
            parentPath: deepPath,
            size: 4096 + k,
            mimetype: 'text/plain'
          });
        }
      }
    }
    for (let k = 1; k <= 6; k += 1) {
      addChild(folderPath, {
        kind: 'file',
        path: `${folderPath}local-${k}.txt`,
        name: `local-${k}.txt`,
        id: `file-${n}-local-${k}`,
        parentId: folderId,
        parentPath: folderPath,
        size: 1536 + k,
        mimetype: 'text/plain'
      });
    }
  }
}

for (let i = 0; i < FILE_COUNT; i += 1) {
  const n = pad(i + 1);
  addChild('bulk/', {
    kind: 'file',
    path: `bulk/file-${n}.txt`,
    name: `file-${n}.txt`,
    id: `file-${n}`,
    parentId: 'folder-bulk',
    parentPath: 'bulk/',
    size: 1024 + i,
    mimetype: 'text/plain'
  });
}

/** 独立多层树：设计稿 / 交付物 */
registerFolder({ id: 'folder-nest', path: 'nest/', name: 'nest', parentPath: '' });
['design', 'delivery', 'archive'].forEach((level1, li) => {
  const level1Id = `folder-nest-${level1}`;
  const level1Path = `nest/${level1}/`;
  registerFolder({
    id: level1Id,
    path: level1Path,
    name: level1,
    parentId: 'folder-nest',
    parentPath: 'nest/'
  });
  addChild(level1Path, {
    kind: 'file',
    path: `${level1Path}readme.md`,
    name: 'readme.md',
    id: `file-nest-${level1}-readme`,
    parentId: level1Id,
    parentPath: level1Path,
    size: 256,
    mimetype: 'text/markdown'
  });
  const level2Names = li === 0 ? ['mobile', 'desktop'] : li === 1 ? ['client-a', 'client-b'] : ['2024', '2025'];
  level2Names.forEach((level2, lj) => {
    const level2Id = `folder-nest-${level1}-${level2}`;
    const level2Path = `${level1Path}${level2}/`;
    registerFolder({
      id: level2Id,
      path: level2Path,
      name: level2,
      parentId: level1Id,
      parentPath: level1Path
    });
    for (let k = 1; k <= 5; k += 1) {
      addChild(level2Path, {
        kind: 'file',
        path: `${level2Path}shot-${k}.png`,
        name: `shot-${k}.png`,
        id: `file-nest-${level1}-${level2}-${k}`,
        parentId: level2Id,
        parentPath: level2Path,
        size: 8192 + k,
        mimetype: 'image/png'
      });
    }
    if (li === 0 && lj === 0) {
      const level3Id = 'folder-nest-design-mobile-icons';
      const level3Path = `${level2Path}icons/`;
      registerFolder({
        id: level3Id,
        path: level3Path,
        name: 'icons',
        parentId: level2Id,
        parentPath: level2Path
      });
      for (let k = 1; k <= NEST_FILE_COUNT; k += 1) {
        addChild(level3Path, {
          kind: 'file',
          path: `${level3Path}icon-${pad(k, 2)}.svg`,
          name: `icon-${pad(k, 2)}.svg`,
          id: `file-nest-icon-${k}`,
          parentId: level3Id,
          parentPath: level3Path,
          size: 512 + k,
          mimetype: 'image/svg+xml'
        });
      }
    }
  });
});

const getSourceByPath = path => {
  const list = childrenByPath.get(path || '') || [];
  return list.slice().sort((left, right) => {
    const leftFolder = left.kind === 'folder' ? 0 : 1;
    const rightFolder = right.kind === 'folder' ? 0 : 1;
    if (leftFolder !== rightFolder) {
      return leftFolder - rightFolder;
    }
    return String(left.name).localeCompare(String(right.name), undefined, { numeric: true, sensitivity: 'base' });
  });
};

const emptyListing = total => ({
  entries: new Array(Math.max(0, total || 0)),
  totalCount: Math.max(0, total || 0),
  loadingIndexes: new Set(),
  ready: false
});

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage']
})(({ remoteModules }) => {
  const [PureGlobal, InfoPage] = remoteModules;
  const [currentPath, setCurrentPath] = useState('bulk/');
  /** 按目录 path 隔离的稀疏分页；分栏展开列靠 columnPath 写入这里 */
  const [columnListings, setColumnListings] = useState(() => {
    const source = getSourceByPath('bulk/');
    return { 'bulk/': emptyListing(source.length) };
  });
  const cacheRef = useRef(new Map());
  const inflightRef = useRef(new Map());
  const perPageRef = useRef(new Map());
  const pathRef = useRef('bulk/');

  const currentListing = columnListings[currentPath] || emptyListing(0);
  const entries = currentListing.entries;
  const totalCount = currentListing.totalCount;
  const loadingIndexes = currentListing.loadingIndexes;
  const ready = currentListing.ready;

  const updateListing = useCallback((path, patch) => {
    const key = path || '';
    setColumnListings(previous => {
      const current = previous[key] || emptyListing(0);
      // 禁止把已有数据的列写成空（展开其它列时绝不能误伤）
      const nextTotal = patch.totalCount !== undefined ? patch.totalCount : current.totalCount;
      const nextEntries = patch.entries !== undefined ? patch.entries : current.entries;
      if (current.ready && current.totalCount > 0 && nextTotal === 0) {
        return previous;
      }
      return {
        ...previous,
        [key]: {
          entries: nextEntries,
          totalCount: nextTotal,
          loadingIndexes: patch.loadingIndexes !== undefined ? patch.loadingIndexes : current.loadingIndexes,
          ready: patch.ready !== undefined ? patch.ready : current.ready
        }
      };
    });
  }, []);

  const rebuildSparse = useCallback(
    (path, source, perPage) => {
      const key = path || '';
      const pageMap = cacheRef.current.get(key) || new Map();
      const next = new Array(source.length);
      pageMap.forEach((pageData, page) => {
        const start = (page - 1) * perPage;
        pageData.forEach((entry, offset) => {
          next[start + offset] = entry;
        });
      });
      updateListing(key, { entries: next, totalCount: source.length, ready: true });
    },
    [updateListing]
  );

  const clearLoadingForPages = useCallback(
    (path, pages, perPage, total) => {
      const key = path || '';
      setColumnListings(previous => {
        const current = previous[key] || emptyListing(total);
        const nextLoading = new Set(current.loadingIndexes || []);
        pages.forEach(page => {
          const start = (page - 1) * perPage;
          for (let i = 0; i < perPage; i += 1) {
            if (total <= 0 || start + i < total) {
              nextLoading.delete(start + i);
            }
          }
        });
        return {
          ...previous,
          [key]: { ...current, loadingIndexes: nextLoading }
        };
      });
    },
    []
  );

  const loadPages = useCallback(
    ({ path, pages, perPage }) => {
      const key = path || '';
      const source = getSourceByPath(key);
      const total = source.length;

      if (!cacheRef.current.has(key)) {
        cacheRef.current.set(key, new Map());
      }
      if (!inflightRef.current.has(key)) {
        inflightRef.current.set(key, new Set());
      }
      const pageMap = cacheRef.current.get(key);
      const inflight = inflightRef.current.get(key);

      const maxPage = Math.max(1, Math.ceil(total / perPage) || 1);
      const needed = [...new Set(pages)].filter(
        page => page >= 1 && page <= maxPage && !pageMap.has(page) && !inflight.has(page)
      );

      if (!needed.length) {
        // 仍有请求在途：不要把未完成缓存标成 ready
        if (inflight.size > 0) {
          return;
        }
        // 缓存已命中：仅在尚未 ready 时回填，避免每次 emit 都 setState 死循环
        setColumnListings(previous => {
          const listing = previous[key];
          if (listing?.ready && listing.totalCount === total && listing.entries?.length === total) {
            return previous;
          }
          if (pageMap.size === 0) {
            return previous;
          }
          const next = new Array(total);
          pageMap.forEach((pageData, page) => {
            const start = (page - 1) * perPage;
            pageData.forEach((entry, offset) => {
              next[start + offset] = entry;
            });
          });
          return {
            ...previous,
            [key]: {
              entries: next,
              totalCount: total,
              loadingIndexes: listing?.loadingIndexes || new Set(),
              ready: true
            }
          };
        });
        return;
      }

      setColumnListings(previous => {
        const current = previous[key] || emptyListing(total);
        // 只更新当前 path，其它列原样保留
        if (current.ready && current.totalCount > 0 && total === 0) {
          return previous;
        }
        const nextLoading = new Set(current.loadingIndexes || []);
        needed.forEach(page => {
          const start = (page - 1) * perPage;
          for (let i = 0; i < perPage; i += 1) {
            if (start + i < total) {
              nextLoading.add(start + i);
            }
          }
        });
        return {
          ...previous,
          [key]: {
            ...current,
            totalCount: total,
            loadingIndexes: nextLoading,
            entries: current.entries?.length === total ? current.entries : new Array(total)
          }
        };
      });

      needed.forEach(page => {
        inflight.add(page);
        window.setTimeout(() => {
          if (perPageRef.current.get(key) !== perPage) {
            inflight.delete(page);
            clearLoadingForPages(key, [page], perPage, total);
            return;
          }
          const start = (page - 1) * perPage;
          pageMap.set(page, source.slice(start, start + perPage));
          inflight.delete(page);
          rebuildSparse(key, source, perPage);
          clearLoadingForPages(key, [page], perPage, total);
        }, 100 + Math.random() * 200);
      });
    },
    [clearLoadingForPages, rebuildSparse]
  );

  const resetForPath = useCallback(path => {
    const key = path || '';
    pathRef.current = key;
    setCurrentPath(key);
    // 切目录时保留其它列缓存，只重置当前目录拉取状态
    if (!cacheRef.current.has(key)) {
      cacheRef.current.set(key, new Map());
    }
    inflightRef.current.set(key, new Set());
    perPageRef.current.delete(key);
    const source = getSourceByPath(key);
    updateListing(key, emptyListing(source.length));
  }, [updateListing]);

  const handleVisibleRangeChange = useCallback(
    ({ startIndex, endIndex, pageSize, path, columnPath, currentPath: rangePath, view }) => {
      // 分栏展开列：用 columnPath / path；其它视图用当前目录
      const listPath =
        path != null ? path : columnPath != null ? columnPath : rangePath != null ? rangePath : pathRef.current;

      if (view !== 'columns' && listPath !== pathRef.current) {
        return;
      }

      let perPage = perPageRef.current.get(listPath);
      if (!perPage) {
        perPage = Math.max(20, Number(pageSize) || calcPageSize({ view: view || 'icons', width: 800, height: 500 }) || 60);
        perPageRef.current.set(listPath, perPage);
      }

      const start = Math.max(0, Number(startIndex) || 0);
      const end = Math.max(start, Number(endIndex) || 0);
      const startPage = Math.floor(start / perPage) + 1;
      const endPage = Math.floor(end / perPage) + 1;
      const pages = [];
      for (let page = startPage; page <= endPage; page += 1) {
        pages.push(page);
      }
      if (startPage > 1) {
        pages.push(startPage - 1);
      }
      pages.push(endPage + 1);
      loadPages({ path: listPath, pages, perPage });
    },
    [loadPages]
  );

  return (
    <PureGlobal
      preset={{
        ajax: async api => ({ data: { code: 0, data: api.loader?.() } }),
        apis: { file: { staticUrl: '' } }
      }}
    >
      <InfoPage>
        <InfoPage.Part title={`虚拟滚动（bulk 大目录 + nest 多层目录，共 ${folderItems.length} 个文件夹节点）`}>
          <p style={{ marginBottom: 12, color: 'rgba(0,0,0,0.45)' }}>
            进入 <code>bulk/folder-01</code> 可测二级/三级。分栏：单击文件夹展开下一列，双击进入目录；每列纵向虚拟滚动。
          </p>
          <div style={{ height: 560 }}>
            <FileSystem
              title="Virtual Scroll Demo"
              defaultView="columns"
              defaultPath="bulk/"
              items={folderItems}
              entries={entries}
              totalCount={totalCount}
              loadingIndexes={loadingIndexes}
              ready={ready}
              columnListings={columnListings}
              onVisibleRangeChange={handleVisibleRangeChange}
              onPathChange={resetForPath}
              onFileOpen={entry => console.log('Open file:', entry)}
              onSelectionChange={selected => console.log('Selection:', selected.length)}
              propertiesPanel
            />
          </div>
        </InfoPage.Part>
      </InfoPage>
    </PureGlobal>
  );
});

render(<BaseExample />);
