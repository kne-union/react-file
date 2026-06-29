import { formatStaticUrl, toAjaxUrl } from '../useStaticUrl';
import computedAccept from '../../components/FileUpload/computedAccept';

describe('formatStaticUrl', () => {
  test('returns absolute urls unchanged', () => {
    expect(formatStaticUrl({ url: 'https://cdn.example.com/a.pdf', staticUrl: '/static/' })).toBe('https://cdn.example.com/a.pdf');
    expect(formatStaticUrl({ url: 'blob:abc', staticUrl: '/static/' })).toBe('blob:abc');
  });

  test('prefixes relative urls with staticUrl', () => {
    expect(formatStaticUrl({ url: 'files/a.pdf', staticUrl: '/static/' })).toBe('/static/files/a.pdf');
  });
});

describe('toAjaxUrl', () => {
  const ajax = { baseApiUrl: '/company' };

  test('returns absolute urls unchanged', () => {
    expect(toAjaxUrl('https://cdn.example.com/a.html', ajax)).toBe('https://cdn.example.com/a.html');
    expect(toAjaxUrl('blob:abc', ajax)).toBe('blob:abc');
  });

  test('strips ajax base prefix from browser static urls', () => {
    expect(toAjaxUrl('/company/api/v1/static/file-id/abc?filename=a.html', ajax)).toBe('/api/v1/static/file-id/abc?filename=a.html');
  });

  test('keeps api-relative urls unchanged', () => {
    expect(toAjaxUrl('/api/v1/static/file-id/abc', ajax)).toBe('/api/v1/static/file-id/abc');
  });
});

describe('computedAccept', () => {
  const file = (name, type) => ({ name, type });

  test('matches extension accept rules', () => {
    expect(computedAccept(file('a.PDF', 'application/pdf'), '.pdf,.png')).toBe(true);
    expect(computedAccept(file('a.doc', 'application/msword'), '.pdf,.png')).toBe(false);
  });

  test('matches mime wildcard rules', () => {
    expect(computedAccept(file('a.bin', 'image/png'), 'image/*')).toBe(true);
    expect(computedAccept(file('a.bin', 'application/pdf'), 'image/*')).toBe(false);
  });

  test('allows all files when accept is empty', () => {
    expect(computedAccept(file('a.bin', 'application/octet-stream'), null)).toBe(true);
  });
});
