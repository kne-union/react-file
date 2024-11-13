import React from 'react';
import { usePreset } from '@kne/global-context';
import Fetch from '@kne/react-fetch';
import TypePreview from './TypePreview';

const OfficePreview = ({ url, apis: propsApis, className, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);

  return (
    <Fetch
      {...(apis.file?.previewOffice || {
        loader: async () => {
          return {
            data: [
              {
                url: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}&wdPrint=0&wdEmbedCode=0`,
                type: 'html'
              }
            ]
          };
        }
      })}
      render={({ data }) => {
        const { data: fileList } = data;
        return fileList.map(({ url, type }) => {
          return <TypePreview {...props} type={type} url={url} className={className} key={url} />;
        });
      }}
    />
  );
};

export default OfficePreview;
