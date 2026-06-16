import { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, Modal } from 'antd';
import JSZip from 'jszip';
import style from './style.module.scss';
import classnames from 'classnames';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import { FileSystemInner } from '../FileSystem';
import InnerTypePreview from './innerTypePreview';
import { PREVIEWABLE_FILE_PATTERN, getZipEntrySize, guessContentType } from './fileExtensions';

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

  return <InnerTypePreview key={preview.url} url={preview.url} filename={preview.filename} />;
};

const ZipPreviewInner = ({ url, className, maxWidth }) => {
  const { formatMessage } = useIntl();
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
        zipRef.current = zip;
        previewCacheRef.current.clear();
        setItems(zipToFileSystemItems(zip));
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

  const extractFile = useCallback(async file => {
    const cached = previewCacheRef.current.get(file.path);
    if (cached) {
      return cached;
    }

    const zipFile = zipRef.current?.file(file.path);
    if (!zipFile) {
      throw new Error('File not found in ZIP');
    }

    const blob = await zipFile.async('blob');
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
      try {
        const preview = await extractFile(file);
        setPreviewFile(preview);
      } catch (err) {
        console.error('Error extracting file from ZIP:', err);
      }
    },
    [extractFile]
  );

  const canPreviewFile = useCallback(file => PREVIEWABLE_FILE_PATTERN.test((file.name || file.path || '').split('?')[0]), []);

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
      <Modal open={Boolean(previewFile)} onCancel={closePreview} footer={null} width="80%" destroyOnClose title={previewFile?.filename} styles={{ body: { maxHeight: '75vh', overflow: 'hidden', padding: 0 } }}>
        {previewFile ? <InnerTypePreview key={previewFile.url} className={style['modal-preview']} url={previewFile.url} filename={previewFile.filename} height={0} /> : null}
      </Modal>
    </div>
  );
};

const ZipPreview = withLocale(ZipPreviewInner);

export { ZipPreviewInner };
export default ZipPreview;
