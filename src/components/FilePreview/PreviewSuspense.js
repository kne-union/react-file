import { Suspense } from 'react';
import { Spin } from 'antd';
import style from './style.module.scss';

const PreviewSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className={style.loading}>
        <Spin />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default PreviewSuspense;
