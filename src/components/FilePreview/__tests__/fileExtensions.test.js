import typeFormat, { canPreviewZipEntry, getOfficePreviewType, guessContentType, PREVIEWABLE_FILE_PATTERN, ZIP_PREVIEWABLE_FILE_PATTERN, ZIP_MAX_ARCHIVE_BYTES, ZIP_MAX_ENTRY_BYTES, ZIP_MAX_ENTRY_COUNT } from '../fileExtensions';
import { createPreviewMapping } from '../createPreviewMapping';
import resolvePreviewType from '../resolvePreviewType';

describe('fileExtensions', () => {
  test('typeFormat detects common file types', () => {
    expect(typeFormat('report.pdf')).toBe('pdf');
    expect(typeFormat('photo.JPG?token=1')).toBe('image');
    expect(typeFormat('archive.zip')).toBe('zip');
    expect(typeFormat('unknown.bin')).toBe('unknown');
    expect(typeFormat(null)).toBe('unknown');
  });

  test('getOfficePreviewType distinguishes docx and xlsx', () => {
    expect(getOfficePreviewType('file.docx')).toBe('docx');
    expect(getOfficePreviewType('file.xlsx')).toBe('xlsx');
    expect(getOfficePreviewType('file.doc')).toBe('office');
  });

  test('guessContentType returns mime by extension', () => {
    expect(guessContentType('a.pdf')).toBe('application/pdf');
    expect(guessContentType('a.unknown')).toBe('application/octet-stream');
  });

  test('PREVIEWABLE_FILE_PATTERN matches previewable archive entries', () => {
    expect(PREVIEWABLE_FILE_PATTERN.test('folder/readme.md')).toBe(true);
    expect(PREVIEWABLE_FILE_PATTERN.test('folder/data.bin')).toBe(false);
  });

  test('ZIP_PREVIEWABLE_FILE_PATTERN excludes legacy office and nested archives', () => {
    expect(ZIP_PREVIEWABLE_FILE_PATTERN.test('folder/readme.md')).toBe(true);
    expect(ZIP_PREVIEWABLE_FILE_PATTERN.test('folder/report.docx')).toBe(true);
    expect(ZIP_PREVIEWABLE_FILE_PATTERN.test('folder/report.doc')).toBe(false);
    expect(ZIP_PREVIEWABLE_FILE_PATTERN.test('folder/report.xls')).toBe(false);
    expect(ZIP_PREVIEWABLE_FILE_PATTERN.test('folder/nested.zip')).toBe(false);
  });

  test('canPreviewZipEntry checks file name or path', () => {
    expect(canPreviewZipEntry({ name: 'report.pdf' })).toBe(true);
    expect(canPreviewZipEntry({ path: 'folder/report.doc' })).toBe(false);
  });

  test('ZIP limits are exported', () => {
    expect(ZIP_MAX_ARCHIVE_BYTES).toBeGreaterThan(0);
    expect(ZIP_MAX_ENTRY_COUNT).toBeGreaterThan(0);
    expect(ZIP_MAX_ENTRY_BYTES).toBeGreaterThan(0);
  });
});

describe('resolvePreviewType', () => {
  test('falls back to filename when url has no extension', () => {
    expect(resolvePreviewType('https://cdn.example.com/files/abc123', 'resume.html')).toBe('html');
    expect(resolvePreviewType('/api/v1/static/file-id/uuid', 'report.pdf')).toBe('pdf');
  });

  test('prefers url type when url extension is known', () => {
    expect(resolvePreviewType('https://cdn.example.com/files/report.pdf', 'resume.html')).toBe('pdf');
  });
});

describe('createPreviewMapping', () => {
  test('zip preview can be disabled for nested archive previews', () => {
    const outer = createPreviewMapping({ includeZipPreview: true });
    const inner = createPreviewMapping({ includeZipPreview: false });

    expect(outer.typeFormatComponent('a.zip')).not.toBe(inner.typeFormatComponent('a.zip'));
    expect(inner.typeFormatComponent('a.zip')).toBe(inner.typeComponentMapping.unknown);
  });
});
