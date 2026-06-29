import { useState } from 'react';
import { Button } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';
import { usePreset } from '@kne/global-context';
import Fetch from '@kne/react-fetch';
import classnames from 'classnames';
import { HtmlPreviewInner } from './HtmlPreview';
import { DocxPreviewInner } from './DocxPreview';
import { XlsxPreviewInner } from './XlsxPreview';
import PreviewShell from './PreviewShell';
import { getOfficePreviewType } from './fileExtensions';
import { UnknownPreviewInner } from './UnknownPreview';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';
import style from './style.module.scss';

const OfficeIframePreview = ({ url, apis: propsApis, className, ...props }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);

  return (
    <Fetch
      {...(apis.file?.previewOffice || {
        loader: async () => {
          return {
            data: [
              {
                url: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`,
                type: 'html'
              }
            ]
          };
        }
      })}
      render={({ data }) => {
        const { data: fileList } = data;
        return fileList.map(({ url: previewUrl }) => {
          return <HtmlPreviewInner {...props} ignoreContent url={previewUrl} className={classnames(className, style['office-iframe-preview'])} key={previewUrl} />;
        });
      }}
    />
  );
};

const OfficeRemotePreview = ({ url, filename, apis, className, showHeader = true, height = 600, onLocalPreview, ...props }) => {
  const { formatMessage } = useIntl();
  const displayFileName = filename || url?.split('?')[0]?.split('/').pop() || '';

  return (
    <PreviewShell
      showHeader={showHeader}
      className={className}
      filename={displayFileName}
      actions={[
        <Button key="local" size="small" icon={<DesktopOutlined />} onClick={onLocalPreview}>
          {formatMessage({ id: 'FilePreview.localPreview' })}
        </Button>
      ]}
      bodyClassName={style['office-viewer-body-remote']}
      bodyStyle={{ minHeight: height || 600, height: '100%' }}
    >
      <OfficeIframePreview {...props} url={url} apis={apis} />
    </PreviewShell>
  );
};

const OfficePreviewInner = ({ url, filename, apis, className, showHeader = true, enableRemotePreview = true, ...props }) => {
  const [previewMode, setPreviewMode] = useState('local');
  const previewType = getOfficePreviewType(url, filename);

  if (previewType === 'docx' || previewType === 'xlsx') {
    if (enableRemotePreview && previewMode === 'remote') {
      return <OfficeRemotePreview {...props} url={url} filename={filename} apis={apis} className={className} showHeader={showHeader} onLocalPreview={() => setPreviewMode('local')} />;
    }

    const onRemotePreview = enableRemotePreview ? () => setPreviewMode('remote') : undefined;

    if (previewType === 'docx') {
      return <DocxPreviewInner {...props} url={url} filename={filename} className={className} showHeader={showHeader} onRemotePreview={onRemotePreview} />;
    }

    return <XlsxPreviewInner {...props} url={url} filename={filename} className={className} showHeader={showHeader} onRemotePreview={onRemotePreview} />;
  }

  if (!enableRemotePreview) {
    return <UnknownPreviewInner className={className} />;
  }

  return <OfficeIframePreview {...props} url={url} apis={apis} className={className} />;
};

const OfficePreview = withLocale(OfficePreviewInner);

export { OfficePreviewInner };
export default OfficePreview;
