import { lazy } from 'react';
import typeFormat from './fileExtensions';

const lazyPreviewInner = (loader, innerExport) => lazy(() => loader().then(module => ({ default: module[innerExport] })));

export const createPreviewMapping = ({ includeZipPreview = true } = {}) => {
  const UnknownPreview = lazyPreviewInner(() => import('./UnknownPreview'), 'UnknownPreviewInner');

  const typeComponentMapping = {
    txt: lazyPreviewInner(() => import('./TextPreview'), 'TextPreviewInner'),
    markdown: lazyPreviewInner(() => import('./MarkdownPreview'), 'MarkdownPreviewInner'),
    pdf: lazyPreviewInner(() => import('./PdfPreview'), 'PdfPreviewInner'),
    image: lazyPreviewInner(() => import('./ImagePreview'), 'ImagePreviewInner'),
    html: lazyPreviewInner(() => import('./HtmlPreview'), 'HtmlPreviewInner'),
    office: lazyPreviewInner(() => import('./OfficePreview'), 'OfficePreviewInner'),
    audio: lazyPreviewInner(() => import('./AudioPreview'), 'AudioPreviewInner'),
    video: lazyPreviewInner(() => import('./VideoPreview'), 'VideoPreviewInner'),
    zip: includeZipPreview ? lazyPreviewInner(() => import('./ZipPreview'), 'ZipPreviewInner') : UnknownPreview,
    json: lazyPreviewInner(() => import('./JsonPreview'), 'JsonPreviewInner'),
    unknown: UnknownPreview
  };

  const typeFormatComponent = url => {
    const key = typeFormat(url);
    return typeComponentMapping[key] || typeComponentMapping.unknown;
  };

  return { typeComponentMapping, typeFormatComponent };
};
