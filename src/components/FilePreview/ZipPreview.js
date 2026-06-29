import { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, Modal, App } from 'antd';
import JSZip from 'jszip';
import style from './style.module.scss';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import { FileSystemInner } from '../FileSystem';
import InnerTypePreview from './innerTypePreview';
import { canPreviewZipEntry, getZipEntrySize, guessContentType, ZIP_MAX_ARCHIVE_BYTES, ZIP_MAX_ENTRY_BYTES, ZIP_MAX_ENTRY_COUNT } from './fileExtensions';

const zipToFileSystemItems = zip => {
  const items = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) {
      items.push({
        kind: 'folder',
        path: relativePath.endsWith('/') ? relativePath : `${relativePath}/`
      });
    } else {
      items.push({
        kind: 'file',
        path: relativePath,
        key: relativePath,
        name: relativePath.split('/').pop() || relativePath,
        size: getZipEntrySize(zipEntry),
        contentType: guessContentType(relativePath)
      });
    }
  });

  return items;
};

const GalleryFilePreview = ({ file, extractFile, errorText }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const result = await extractFile(file);
        if (!cancelled) {
          setPreview(result);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error extracting file from ZIP:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [file, extractFile]);

  if (loading) {
    return (
      <div className={style['loading']}>
        <Spin />
      </div>
    );
  }

  if (error || !preview) {
    return <div className={style['error']}>{errorText}</div>;
  }

  return <InnerTypePreview key={preview.url} url={preview.url} filename={preview.filename} enableRemotePreview={false} />;
};

const ZipPreviewInner = ({ url, className, maxWidth }) => {
  const { formatMessage } = useIntl();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const zipRef = useRef(null);
  const blobUrlsRef = useRef([]);
  const previewCacheRef = useRef(new Map());

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    const previewCache = previewCacheRef.current;

    return () => {
      blobUrls.forEach(blobUrl => URL.revokeObjectURL(blobUrl));
      blobUrls.length = 0;
      previewCache.clear();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadZip = async () => {
      try {
        setLoading(true);
        setError(false);
        setItems([]);
        zipRef.current = null;
        previewCacheRef.current.clear();

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch ZIP file');
        }

        const blob = await response.blob();
        if (cancelled) {
          return;
        }

        if (blob.size > ZIP_MAX_ARCHIVE_BYTES) {
          throw new Error('ZIP archive is too large');
        }

        const zip = await JSZip.loadAsync(blob);
        if (cancelled) {
          return;
        }

        const nextItems = zipToFileSystemItems(zip);
        if (nextItems.filter(item => item.kind === 'file').length > ZIP_MAX_ENTRY_COUNT) {
          throw new Error('ZIP archive contains too many files');
        }

        zipRef.current = zip;
        setItems(nextItems);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ZIP file:', err);
        if (!cancelled) {
          setLoading(false);
          setError(true);
        }
      }
    };

    if (url) {
      loadZip();
    }

    return () => {
      cancelled = true;
    };
  }, [url]);

  const extractFile = useCallback(async file => {
    const cached = previewCacheRef.current.get(file.path);
    if (cached) {
      return cached;
    }

    const zipFile = zipRef.current?.file(file.path);
    if (!zipFile) {
      throw new Error('File not found in ZIP');
    }

    const entrySize = file.size ?? getZipEntrySize(zipFile);
    if (entrySize > ZIP_MAX_ENTRY_BYTES) {
      throw new Error('ZIP entry is too large');
    }

    const blob = await zipFile.async('blob');
    if (blob.size > ZIP_MAX_ENTRY_BYTES) {
      throw new Error('ZIP entry is too large');
    }

    const blobUrl = URL.createObjectURL(blob);
    blobUrlsRef.current.push(blobUrl);

    const preview = {
      url: blobUrl,
      filename: file.name || file.path
    };
    previewCacheRef.current.set(file.path, preview);
    return preview;
  }, []);

  const handleFileOpen = useCallback(
    async file => {
      if (!canPreviewZipEntry(file)) {
        message.warning(formatMessage({ id: 'FilePreview.unSupportFileType' }));
        return;
      }

      try {
        const preview = await extractFile(file);
        setPreviewFile(preview);
      } catch (err) {
        console.error('Error extracting file from ZIP:', err);
        message.error(formatMessage({ id: 'FilePreview.fileLoadedError' }));
      }
    },
    [extractFile, formatMessage, message]
  );

  const canPreviewFile = useCallback(file => canPreviewZipEntry(file), []);

  const renderFilePreview = useCallback(file => <GalleryFilePreview file={file} extractFile={extractFile} errorText={formatMessage({ id: 'FilePreview.fileLoadedError' })} />, [extractFile, formatMessage]);

  const closePreview = () => {
    setPreviewFile(null);
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
          <div className={style['error']}>{formatMessage({ id: 'FilePreview.fileLoadedError' })}</div>
        </div>
      ) : (
        !loading && <FileSystemInner items={items} title={formatMessage({ id: 'FilePreview.zipArchive' })} defaultView="list" onFileOpen={handleFileOpen} renderFilePreview={renderFilePreview} canPreviewFile={canPreviewFile} />
      )}
      <Modal open={Boolean(previewFile)} onCancel={closePreview} footer={null} width="80%" destroyOnClose title={previewFile?.filename} styles={{ body: { maxHeight: '75vh', overflow: 'auto', padding: 0 } }}>
        {previewFile ? <InnerTypePreview key={previewFile.url} className={style['modal-preview']} url={previewFile.url} filename={previewFile.filename} enableRemotePreview={false} /> : null}
      </Modal>
    </div>
  );
};

const ZipPreview = withLocale(ZipPreviewInner);

export { ZipPreviewInner };
export default ZipPreview;
