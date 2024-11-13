import React from 'react';
import { usePreset } from '@kne/global-context';
import Fetch from '@kne/react-fetch';
import merge from 'lodash/merge';

const withOSSFile = WrappedComponent => {
  return p => {
    const {
      id,
      url,
      error,
      apis: currentApis,
      loading,
      ttl,
      cacheName,
      ...props
    } = Object.assign(
      {},
      {
        loading: null,
        ttl: 1000 * 60 * 100,
        cacheName: 'file-cache'
      },
      p
    );

    const { apis: baseApis } = usePreset();
    const apis = merge({}, baseApis, currentApis);

    if (!id) {
      return null;
    }
    if (!apis.file?.getUrl) {
      throw new Error('请在Global组件设置preset.apis.file.getUrl参数');
    }

    const { paramsType, paramsName, ...fileApi } = Object.assign(
      {
        paramsType: 'params',
        paramsName: 'id'
      },
      apis.file.getUrl
    );

    const fetchProps = {};
    fetchProps[paramsType] = { [paramsName]: id };

    return (
      <Fetch
        {...Object.assign({}, fileApi, fetchProps)}
        updateType="refresh"
        error={error}
        loading={loading}
        cache={cacheName}
        ttl={ttl}
        render={({ data, ...fetchApi }) => <WrappedComponent {...props} id={id} data={data} fetchApi={fetchApi} />}
      />
    );
  };
};

export default withOSSFile;
