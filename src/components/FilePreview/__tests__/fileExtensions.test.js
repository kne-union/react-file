import typeFormat, { getOfficePreviewType, guessContentType, PREVIEWABLE_FILE_PATTERN } from '../fileExtensions';
import { createPreviewMapping } from '../createPreviewMapping';

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
});

describe('createPreviewMapping', () => {
  test('zip preview can be disabled for nested archive previews', () => {
    const outer = createPreviewMapping({ includeZipPreview: true });
    const inner = createPreviewMapping({ includeZipPreview: false });

    expect(outer.typeFormatComponent('a.zip')).not.toBe(inner.typeFormatComponent('a.zip'));
    expect(inner.typeFormatComponent('a.zip')).toBe(inner.typeComponentMapping.unknown);
  });
});
