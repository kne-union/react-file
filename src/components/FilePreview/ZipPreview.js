import React, { useState, useEffect } from 'react';
import { Tree, Spin } from 'antd';
import JSZip from 'jszip';
import style from './style.module.scss';
import classnames from 'classnames';
import { createWithIntlProvider, useIntl } from '@kne/react-intl';
import zhCn from '../../locale/zh-CN';

const formatFileSize = bytes => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ZipPreview = createWithIntlProvider(
  'zh-CN',
  zhCn,
  'react-file'
)(({ url, className, maxWidth }) => {
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    const loadZip = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch ZIP file');
        }

        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        const files = [];
        zip.forEach((relativePath, zipEntry) => {
          files.push({
            key: relativePath,
            name: relativePath.split('/').pop() || relativePath,
            path: relativePath,
            isDir: zipEntry.dir,
            size: zipEntry._data ? zipEntry._data.uncompressedSize : 0,
            compressedSize: zipEntry._data ? zipEntry._data.compressedSize : 0
          });
        });

        // 构建树形结构
        const buildTree = items => {
          const root = [];
          const map = {};
          const dirKeys = [];

          // 先按路径排序
          items.sort((a, b) => a.path.localeCompare(b.path));

          items.forEach(item => {
            const parts = item.path.split('/').filter(Boolean);
            let currentPath = '';
            let currentLevel = root;

            parts.forEach((part, index) => {
              currentPath += (currentPath ? '/' : '') + part;
              const isLast = index === parts.length - 1;

              if (!map[currentPath]) {
                const isDirectory = !isLast || item.isDir;
                const node = {
                  key: currentPath,
                  title: (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: isDirectory ? 'var(--primary-color)' : 'inherit',
                        cursor: isDirectory ? 'pointer' : 'default'
                      }}
                    >
                      <span>{part}</span>
                      {!isDirectory && (
                        <>
                          <span style={{ color: '#999', fontSize: '12px', whiteSpace: 'nowrap' }}>{formatFileSize(item.size)}</span>
                          <span style={{ color: '#bbb', fontSize: '12px', whiteSpace: 'nowrap' }}>({formatFileSize(item.compressedSize)})</span>
                        </>
                      )}
                    </span>
                  ),
                  name: part,
                  path: currentPath,
                  isDir: isDirectory,
                  size: isLast ? item.size : 0,
                  compressedSize: isLast ? item.compressedSize : 0,
                  children: []
                };

                if (isDirectory) {
                  dirKeys.push(currentPath);
                }

                map[currentPath] = node;
                currentLevel.push(node);
              }

              if (!isLast || item.isDir) {
                currentLevel = map[currentPath].children;
              }
            });
          });

          return { tree: root, dirKeys };
        };

        const { tree, dirKeys } = buildTree(files);
        setTreeData(tree);
        setExpandedKeys(dirKeys);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ZIP file:', err);
        setLoading(false);
        setError(true);
      }
    };

    if (url) {
      loadZip();
    }
  }, [url]);

  const onExpand = keys => {
    setExpandedKeys(keys);
  };

  const onSelect = (selectedKeys, info) => {
    const selectedKey = selectedKeys[0];
    if (selectedKey && info.node.isDir) {
      const isExpanded = expandedKeys.includes(selectedKey);
      if (isExpanded) {
        setExpandedKeys(expandedKeys.filter(key => key !== selectedKey));
      } else {
        setExpandedKeys([...expandedKeys, selectedKey]);
      }
    }
  };

  return (
    <div
      className={classnames(className, style['container'])}
      style={{
        maxWidth
      }}
    >
      {loading ? (
        <div className={style['loading']}>
          <Spin />
        </div>
      ) : null}
      {error ? (
        <div className={style['text-outer']}>
          <div className={style['error']}>{formatMessage({ id: 'fileLoadedError' })}</div>
        </div>
      ) : (
        <div className={style['text-inner']}>
          <Tree
            showIcon
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            onSelect={onSelect}
            treeData={treeData}
            style={{
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px'
            }}
          />
        </div>
      )}
    </div>
  );
});

export default ZipPreview;
