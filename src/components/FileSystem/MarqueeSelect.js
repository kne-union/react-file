import { useCallback, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import style from './FileSystem.module.scss';

const DRAG_THRESHOLD = 4;

const normalizeRect = (x0, y0, x1, y1) => ({
  left: Math.min(x0, x1),
  top: Math.min(y0, y1),
  right: Math.max(x0, x1),
  bottom: Math.max(y0, y1),
  width: Math.abs(x1 - x0),
  height: Math.abs(y1 - y0)
});

const rectsIntersect = (a, b) => !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

const isItemTarget = target => {
  if (!target || typeof target.closest !== 'function') {
    return false;
  }
  return !!target.closest('[data-fs-path]');
};

const toLocalRect = (container, clientRect) => {
  const box = container.getBoundingClientRect();
  return {
    left: clientRect.left - box.left + container.scrollLeft,
    top: clientRect.top - box.top + container.scrollTop,
    width: clientRect.width,
    height: clientRect.height
  };
};

const MarqueeSelect = ({ enabled = true, className, children, onMarqueeSelect, onEmptyClick }) => {
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const [rect, setRect] = useState(null);

  const collectPaths = useCallback(selectionRect => {
    const container = containerRef.current;
    if (!container) {
      return [];
    }
    const nodes = container.querySelectorAll('[data-fs-path]');
    const paths = [];
    nodes.forEach(node => {
      const path = node.getAttribute('data-fs-path');
      if (!path) {
        return;
      }
      const box = node.getBoundingClientRect();
      if (rectsIntersect(selectionRect, box)) {
        paths.push(path);
      }
    });
    return paths;
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const onMove = event => {
      const drag = dragRef.current;
      const container = containerRef.current;
      if (!drag || !container) {
        return;
      }

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.active && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
        return;
      }

      if (!drag.active) {
        drag.active = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'default';
        onMarqueeSelect?.([], { additive: drag.additive, preview: true, dragging: true });
      }

      const clientRect = normalizeRect(drag.startX, drag.startY, event.clientX, event.clientY);
      drag.rect = clientRect;
      setRect(toLocalRect(container, clientRect));

      const paths = collectPaths(clientRect);
      onMarqueeSelect?.(paths, { additive: drag.additive, preview: true, dragging: true });
    };

    const onUp = event => {
      const drag = dragRef.current;
      dragRef.current = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      setRect(null);

      if (!drag) {
        return;
      }

      if (drag.active) {
        const finalRect = drag.rect || normalizeRect(drag.startX, drag.startY, event.clientX, event.clientY);
        const paths = collectPaths(finalRect);
        onMarqueeSelect?.(paths, { additive: drag.additive, preview: false, dragging: false });
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!isItemTarget(event.target)) {
        onEmptyClick?.(event);
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [collectPaths, enabled, onEmptyClick, onMarqueeSelect]);

  const handleMouseDown = event => {
    if (!enabled || event.button !== 0) {
      return;
    }
    if (isItemTarget(event.target)) {
      return;
    }

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      additive: !!(event.metaKey || event.ctrlKey),
      active: false,
      rect: null
    };
  };

  return (
    <div ref={containerRef} className={classnames(style['marquee-root'], className)} onMouseDown={handleMouseDown}>
      {children}
      {rect ? (
        <div
          className={style['marquee-rect']}
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }}
        />
      ) : null}
    </div>
  );
};

export default MarqueeSelect;
