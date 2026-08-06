import { Suspense } from 'react';
import { Skeleton } from 'antd';
import style from './style.module.scss';

const PreviewSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className={style['loading-skeleton']}>
        <Skeleton.Image active className={style['image-skeleton']} />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default PreviewSuspense;
