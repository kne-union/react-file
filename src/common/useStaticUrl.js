import { usePreset } from '@kne/global-context';

export const formatStaticUrl = ({ url, staticUrl }) => {
  return /^(blob:)?https?:\/\//.test(url) ? url : staticUrl + url;
};

const useStaticUrl = ({ url, staticUrl: staticUrlProps }) => {
  const { apis } = usePreset();
  const staticUrl = staticUrlProps || apis.file?.staticUrl || '';
  return formatStaticUrl({ staticUrl, url });
};

export default useStaticUrl;
