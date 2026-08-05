import { createPreviewMapping } from './createPreviewMapping';
import { globalParams } from '../../globalParams';
import typeFormat from './fileExtensions';

const { typeComponentMapping: defaultPreviewMapping } = createPreviewMapping({ includeZipPreview: true });

if (!globalParams.previewMapping) {
  globalParams.previewMapping = defaultPreviewMapping;
}

export const getPreviewMapping = () => globalParams.previewMapping || defaultPreviewMapping;

/** 与 globalParams.previewMapping 为同一引用，preset 合并后可直接读到扩展类型 */
export const typeComponentMapping = getPreviewMapping();

export const typeFormatComponent = url => {
  const mapping = getPreviewMapping();
  const key = typeFormat(url);
  return mapping[key] || mapping.unknown || defaultPreviewMapping.unknown;
};
