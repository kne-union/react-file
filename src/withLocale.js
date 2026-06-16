import { createWithIntlProvider } from '@kne/react-intl';
import zhCn from './locale/zh-CN';

const withLocale = WrappedComponent => {
  return createWithIntlProvider('zh-CN', zhCn, 'react-file')(WrappedComponent);
};

export default withLocale;
