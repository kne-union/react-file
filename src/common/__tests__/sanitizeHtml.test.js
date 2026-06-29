/** @jest-environment jsdom */

import { sanitizeHtmlDocument } from '../sanitizeHtml';

const parseHtml = html => {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
};

describe('sanitizeHtmlDocument', () => {
  test('removes script tags and inline event handlers', () => {
    const doc = parseHtml('<div onclick="alert(1)"><script>alert(1)</script><p>ok</p></div>');
    sanitizeHtmlDocument(doc);
    const html = doc.body.innerHTML;
    expect(html).not.toContain('script');
    expect(html).not.toContain('onclick');
    expect(html).toContain('ok');
  });

  test('removes javascript: urls', () => {
    const doc = parseHtml('<a href="javascript:alert(1)">link</a>');
    sanitizeHtmlDocument(doc);
    expect(doc.querySelector('a')?.getAttribute('href')).toBeNull();
  });

  test('removes iframe and object tags', () => {
    const doc = parseHtml('<iframe src="https://evil.com"></iframe><object data="x"></object><span>text</span>');
    sanitizeHtmlDocument(doc);
    expect(doc.querySelector('iframe')).toBeNull();
    expect(doc.querySelector('object')).toBeNull();
    expect(doc.body.textContent).toContain('text');
  });
});
