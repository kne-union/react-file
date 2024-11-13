import React, { memo, useMemo, useState } from 'react';
import { Flex, Spin } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import style from './style.module.scss';
import useResize from '@kne/use-resize';
import classnames from 'classnames';
import { usePreset } from '@kne/global-context';

const PdfPreview = memo(p => {
  const {
    url,
    apis: propsApis,
    maxWidth,
    scale,
    rotate,
    className
  } = Object.assign(
    {},
    {
      autoSize: true,
      renderTextLayer: false,
      scale: 100,
      rotate: 0,
      maxWidth: 1200
    },
    p
  );

  const [numPages, setNumPages] = useState(0);
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis, propsApis);

  const pdfjsUrl = apis.file?.pdfjsUrl || 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168';
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsUrl + '/build/pdf.worker.mjs';
  const documentProps = useMemo(() => {
    return {
      file: url,
      options: {
        standardFontDataUrl: pdfjsUrl + '/standard_fonts/',
        cMapUrl: pdfjsUrl + '/cmaps/',
        cMapPacked: true
      }
    };
  }, [pdfjsUrl, url]);
  const [width, setWidth] = useState(maxWidth);
  const ref = useResize(() => {
    if (ref.current && ref.current.clientWidth) {
      setWidth(Math.min(ref.current.clientWidth, maxWidth));
    }
  });
  return (
    <div
      ref={ref}
      className={classnames(className, style['container'])}
      style={{
        maxWidth: maxWidth
      }}
    >
      <Document
        {...documentProps}
        error="PDF文件加载失败"
        loading={
          <div className={style['loading']}>
            <Spin />
          </div>
        }
        noData="未指定PDF文件"
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
        }}
      >
        <Flex vertical gap={8}>
          {numPages >= 1 &&
            Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index}`} className="preview-item" scale={scale / 100} rotate={rotate} pageNumber={index + 1} width={width} loading={null} renderAnnotationLayer={false} renderTextLayer={true} noData="未指定页面" />
            ))}
        </Flex>
      </Document>
    </div>
  );
});

export default PdfPreview;
