const UNSAFE_TAGS = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form'];
const UNSAFE_ATTR_PATTERN = /^on/i;
const UNSAFE_URL_ATTRS = ['href', 'src', 'xlink:href', 'action', 'formaction', 'data'];
const UNSAFE_URL_PATTERN = /^\s*javascript:/i;

export const sanitizeHtmlDocument = domDocument => {
  UNSAFE_TAGS.forEach(tag => {
    domDocument.querySelectorAll(tag).forEach(el => {
      el.remove();
    });
  });

  domDocument.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      const isUnsafeEvent = UNSAFE_ATTR_PATTERN.test(attr.name);
      const isUnsafeUrl = UNSAFE_URL_ATTRS.includes(attr.name.toLowerCase()) && UNSAFE_URL_PATTERN.test(attr.value);

      if (isUnsafeEvent || isUnsafeUrl) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return domDocument;
};
