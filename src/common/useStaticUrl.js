import { usePreset } from '@kne/global-context';

export const formatStaticUrl = ({ url, staticUrl }) => {
  return /^(blob:|https?:\/\/)/.test(url) ? url : staticUrl + url;
};

const resolveAjaxBaseUrl = ajax => {
  if (!ajax) {
    return '';
  }
  return ajax.baseApiUrl || ajax.defaults?.baseURL || '';
};

export const toAjaxUrl = (url, ajax) => {
  if (!url || /^(blob:|https?:\/\/)/.test(url)) {
    return url;
  }
  const baseUrl = String(resolveAjaxBaseUrl(ajax) || '').replace(/\/+$/, '');
  if (!baseUrl) {
    return url;
  }
  if (url === baseUrl || url.startsWith(`${baseUrl}/`)) {
    const relative = url.slice(baseUrl.length);
    return relative.startsWith('/') ? relative : `/${relative}`;
  }
  return url;
};

const useStaticUrl = ({ url, staticUrl: staticUrlProps }) => {
  const { apis } = usePreset();
  const staticUrl = staticUrlProps || apis.file?.staticUrl || '';
  return formatStaticUrl({ staticUrl, url });
};

export default useStaticUrl;
