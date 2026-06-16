export const normalizeFolderPath = path => {
  if (!path || path === '/') return '';
  return path.endsWith('/') ? path : `${path}/`;
};

export const pathName = path => {
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
  const separatorIndex = trimmed.lastIndexOf('/');
  return separatorIndex === -1 ? trimmed : trimmed.slice(separatorIndex + 1);
};

export const pathParent = path => {
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
  const separatorIndex = trimmed.lastIndexOf('/');
  return separatorIndex === -1 ? '' : trimmed.slice(0, separatorIndex + 1);
};

export const fileExtension = name => {
  const dotIndex = name.lastIndexOf('.');
  return dotIndex === -1 ? '' : name.slice(dotIndex + 1).toLowerCase();
};

export const formatByteSize = size => {
  if (size === undefined || size === null) return '-';
  if (size === 0) return '0 B';
  if (size < 1000) return `${size} B`;

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size;

  for (const unit of units) {
    value /= 1000;
    if (value < 1000 || unit === 'TB') {
      const rounded = value >= 100 ? Math.round(value) : value.toFixed(value >= 10 ? 1 : 2).replace(/\.?0+$/, '');
      return `${rounded} ${unit}`;
    }
  }

  return '-';
};

export const buildFileSystemIndex = items => {
  const folders = new Map();
  const files = new Map();

  const ensureFolderChain = folderPath => {
    let path = normalizeFolderPath(folderPath);

    while (path && !folders.has(path)) {
      folders.set(path, {
        kind: 'folder',
        name: pathName(path),
        parentPath: pathParent(path),
        path
      });
      path = pathParent(path);
    }
  };

  items.forEach(item => {
    if (item.kind === 'folder') {
      const path = normalizeFolderPath(item.path);
      if (!path) return;

      folders.set(path, {
        ...item,
        kind: 'folder',
        name: item.name || pathName(path),
        parentPath: normalizeFolderPath(item.parentPath || pathParent(path)),
        path
      });
      ensureFolderChain(pathParent(path));
      return;
    }

    if (!item.path) return;

    files.set(item.path, {
      ...item,
      kind: 'file',
      key: item.key || item.path,
      name: item.name || pathName(item.path),
      parentPath: normalizeFolderPath(item.parentPath || pathParent(item.path))
    });
    ensureFolderChain(pathParent(item.path));
  });

  const children = new Map();
  const pushChild = entry => {
    const siblings = children.get(entry.parentPath);
    if (siblings) {
      siblings.push(entry);
    } else {
      children.set(entry.parentPath, [entry]);
    }
  };

  folders.forEach(folder => pushChild(folder));
  files.forEach(file => pushChild(file));

  children.forEach(siblings => {
    siblings.sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: 'base' }));
  });

  return { children, files, folders };
};

export const normalizeSearchQuery = value => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.replace(/\\/g, '/').toLowerCase();
};

export const buildNestedEntries = (index, parentPath = '') => {
  const entries = index.children.get(parentPath) || [];
  return entries.map(entry => {
    if (entry.kind === 'folder') {
      return {
        ...entry,
        children: buildNestedEntries(index, entry.path)
      };
    }
    return entry;
  });
};
