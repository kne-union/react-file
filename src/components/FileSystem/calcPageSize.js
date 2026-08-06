/** 图标网格：单元格宽 96 + gap 8，四周 padding 16 */
export const ICONS_GAP = 8;
export const ICONS_CELL_WIDTH = 96 + ICONS_GAP;
export const ICONS_PADDING = 16;
export const ICONS_PADDING_X = ICONS_PADDING * 2;
/** 单个图标单元格内容高度（不含行间距） */
export const ICONS_ITEM_HEIGHT = 110;
/** 虚拟列表行步进 = 内容高度 + 与横向一致的间距 */
export const ICONS_ROW_STRIDE = ICONS_ITEM_HEIGHT + ICONS_GAP;
/** 对齐非虚拟列表 ant Tree：titleHeight(controlHeightSM=24) 被 .tree-wrap 提成 28，再加 treeNodePadding */
export const LIST_ROW_HEIGHT = 28;
/** 对齐 ant Tree `paddingXS / 2` 的节点间距 */
export const LIST_ROW_GAP = 4;
export const LIST_ROW_STRIDE = LIST_ROW_HEIGHT + LIST_ROW_GAP;
/** 对齐非虚拟列表 .tree-wrap：padding 8px 12px 16px */
export const LIST_PADDING_TOP = 8;
export const LIST_PADDING_RIGHT = 12;
export const LIST_PADDING_BOTTOM = 16;
export const LIST_PADDING_LEFT = 12;
/** 对齐 ant-tree switcher(24) + content-wrapper paddingInline(8) */
export const LIST_SWITCHER_WIDTH = 24;
export const LIST_CONTENT_INLINE_PAD = 8;
export const COLUMN_ITEM_HEIGHT = 36;
/** 画廊侧栏：与普通模式 .gallery-filmstrip gap/padding 对齐 */
export const GALLERY_FILM_GAP = 2;
export const GALLERY_FILM_PADDING = 8;
export const GALLERY_FILM_ITEM_HEIGHT = 40;
export const GALLERY_FILM_STRIDE = GALLERY_FILM_ITEM_HEIGHT + GALLERY_FILM_GAP;

export const PAGE_SIZE_MIN = 20;
export const PAGE_SIZE_MAX = 200;
export const PAGE_SIZE_BUFFER = 2;

/**
 * 根据视口与展示类型估算一页可展示数量（含缓冲）。
 * @param {{ view: string, width: number, height: number, buffer?: number }} options
 * @returns {number}
 */
export const calcPageSize = ({ view, width, height, buffer = PAGE_SIZE_BUFFER } = {}) => {
  const w = Math.max(0, Number(width) || 0);
  const h = Math.max(0, Number(height) || 0);
  const factor = Math.max(1, Number(buffer) || PAGE_SIZE_BUFFER);

  let visible = 0;
  if (view === 'icons') {
    const cols = Math.max(1, Math.floor((w - ICONS_PADDING_X) / ICONS_CELL_WIDTH));
    const rows = Math.max(1, Math.ceil(h / ICONS_ROW_STRIDE));
    visible = cols * rows;
  } else if (view === 'columns') {
    visible = Math.max(1, Math.ceil(h / COLUMN_ITEM_HEIGHT));
  } else if (view === 'gallery') {
    const inner = Math.max(0, h - GALLERY_FILM_PADDING * 2);
    visible = Math.max(1, Math.ceil(inner / GALLERY_FILM_STRIDE));
  } else {
    // list / 默认：扣除与 .tree-wrap 一致的上下内边距，步进对齐 Tree 节点高+间距
    const inner = Math.max(0, h - LIST_PADDING_TOP - LIST_PADDING_BOTTOM);
    visible = Math.max(1, Math.ceil(inner / LIST_ROW_STRIDE));
  }

  return Math.min(PAGE_SIZE_MAX, Math.max(PAGE_SIZE_MIN, Math.ceil(visible * factor)));
};

export default calcPageSize;
