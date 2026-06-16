import { formatStaticUrl } from '../useStaticUrl';
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
