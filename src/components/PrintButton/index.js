import React, { useState } from 'react';
import { Button } from 'antd';
import { useReactToPrint } from 'react-to-print';

const PrintButton = ({ content, onSuccess, onError, printProps, contentRef, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handler = useReactToPrint({
    contentRef,
    bodyClass: document.body.getAttribute('class'),
    onBeforePrint: async () => {
      setIsLoading(true);
    },
    onPrintError: (...args) => {
      setIsLoading(false);
      onError && onError(...args);
    },
    onAfterPrint: (...args) => {
      setIsLoading(false);
      onSuccess && onSuccess(...args);
    },
    ...printProps
  });
  return (
    <Button
      {...props}
      onClick={() => {
        setIsLoading(true);
        handler();
      }}
      loading={isLoading}
    />
  );
};

export default PrintButton;
