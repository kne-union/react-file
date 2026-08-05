import { useMemo } from 'react';
import { useIntl } from '@kne/react-intl';
import ButtonGroup from '@kne/button-group';
import '@kne/button-group/dist/index.css';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, SwapOutlined, FolderOpenOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import EntryIcon from './EntryIcon';
import { fileExtension, formatByteSize } from './utils';
import style from './FileSystem.module.scss';

export const countDirectChildren = (folderPath, index) => {
  const children = index?.children?.get(folderPath) || [];
  let folders = 0;
  let files = 0;
  children.forEach(child => {
    if (child.kind === 'folder') {
      folders += 1;
    } else {
      files += 1;
    }
  });
  return { folders, files };
};

export const summarizeSelection = selectedEntries => {
  let folders = 0;
  let files = 0;
  (selectedEntries || []).forEach(entry => {
    if (entry.kind === 'folder') {
      folders += 1;
    } else {
      files += 1;
    }
  });
  return { folders, files };
};

const formatDateTime = value => {
  if (value == null || value === '') {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
};

export const getEntryTypeLabel = (entry, formatMessage) => {
  if (entry.kind === 'folder') {
    return formatMessage({ id: 'FileSystem.folder' });
  }
  const ext = fileExtension(entry.name || '');
  if (ext) {
    return ext.toUpperCase();
  }
  if (entry.mimetype) {
    return entry.mimetype;
  }
  return formatMessage({ id: 'FileSystem.propertiesType' });
};

const formatCountParts = (folders, files, formatMessage) => {
  const parts = [];
  if (folders > 0) {
    parts.push(formatMessage({ id: 'FileSystem.propertiesFolderCountPart' }, { count: folders }));
  }
  if (files > 0) {
    parts.push(formatMessage({ id: 'FileSystem.propertiesFileCountPart' }, { count: files }));
  }
  return parts;
};

export const formatFolderSubtitle = (folders, files, formatMessage) => {
  const parts = formatCountParts(folders, files, formatMessage);
  if (parts.length === 0) {
    return formatMessage({ id: 'FileSystem.emptyFolder' });
  }
  return parts.join(formatMessage({ id: 'FileSystem.propertiesCountSeparator' }));
};

export const InfoRow = ({ label, value }) => {
  if (value == null || value === '') {
    return null;
  }
  return (
    <div className={style['properties-info-row']}>
      <span className={style['properties-info-label']}>{label}</span>
      <span className={style['properties-info-value']} title={typeof value === 'string' ? value : undefined}>
        {value}
      </span>
    </div>
  );
};

export const Section = ({ title, children }) => {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children].filter(Boolean);
  if (items.length === 0) {
    return null;
  }
  return (
    <div className={style['properties-section']}>
      {title ? <div className={style['properties-section-title']}>{title}</div> : null}
      <div className={style['properties-section-body']}>{items}</div>
    </div>
  );
};

const ACTION_META = {
  view: { icon: <EyeOutlined />, localeId: 'FileSystem.actionView' },
  replace: { icon: <SwapOutlined />, localeId: 'FileSystem.actionReplace' },
  rename: { icon: <EditOutlined />, localeId: 'FileSystem.actionRename' },
  download: { icon: <DownloadOutlined />, localeId: 'FileSystem.actionDownload' },
  move: { icon: <FolderOpenOutlined />, localeId: 'FileSystem.actionMove' },
  delete: { icon: <DeleteOutlined />, localeId: 'FileSystem.actionDelete', danger: true, isDelete: true }
};

export const getDefaultActions = ({ selectedEntries, formatMessage, onAction } = {}) => {
  const entries = selectedEntries || [];
  if (!entries.length) {
    return [];
  }

  const single = entries.length === 1 ? entries[0] : null;
  const emit = key => () => onAction?.(key, { entry: single, selectedEntries: entries });

  if (single) {
    const isFile = single.kind === 'file';
    return [
      isFile
        ? {
            key: 'view',
            icon: ACTION_META.view.icon,
            children: formatMessage({ id: ACTION_META.view.localeId }),
            onClick: emit('view')
          }
        : null,
      isFile
        ? {
            key: 'replace',
            icon: ACTION_META.replace.icon,
            children: formatMessage({ id: ACTION_META.replace.localeId }),
            onClick: emit('replace')
          }
        : null,
      {
        key: 'rename',
        icon: ACTION_META.rename.icon,
        children: formatMessage({ id: ACTION_META.rename.localeId }),
        onClick: emit('rename')
      },
      {
        key: 'download',
        icon: ACTION_META.download.icon,
        children: formatMessage({ id: ACTION_META.download.localeId }),
        onClick: emit('download')
      },
      {
        key: 'move',
        icon: ACTION_META.move.icon,
        children: formatMessage({ id: ACTION_META.move.localeId }),
        onClick: emit('move')
      },
      {
        key: 'delete',
        icon: ACTION_META.delete.icon,
        children: formatMessage({ id: ACTION_META.delete.localeId }),
        danger: true,
        isDelete: true,
        onClick: emit('delete')
      }
    ].filter(Boolean);
  }

  return [
    {
      key: 'download',
      icon: ACTION_META.download.icon,
      children: formatMessage({ id: ACTION_META.download.localeId }),
      onClick: emit('download')
    },
    {
      key: 'move',
      icon: ACTION_META.move.icon,
      children: formatMessage({ id: ACTION_META.move.localeId }),
      onClick: emit('move')
    },
    {
      key: 'delete',
      icon: ACTION_META.delete.icon,
      children: formatMessage({ id: ACTION_META.delete.localeId }),
      danger: true,
      isDelete: true,
      onClick: emit('delete')
    }
  ];
};

const mergeActionList = (baseList, extraList) => {
  if (!Array.isArray(extraList) || extraList.length === 0) {
    return baseList;
  }
  const map = new Map(baseList.map(item => [item.key, item]));
  extraList.forEach(item => {
    if (!item) {
      return;
    }
    if (item.key && map.has(item.key)) {
      map.set(item.key, Object.assign({}, map.get(item.key), item));
      return;
    }
    if (item.key) {
      map.set(item.key, item);
      return;
    }
    map.set(`extra-${map.size}`, item);
  });
  return [...map.values()].filter(item => item && item.hidden !== true);
};

const normalizeActionList = list => (Array.isArray(list) ? list.filter(item => item && item.hidden !== true) : []);

/**
 * propertiesActions / actions:
 * - false：关闭操作区
 * - array：按 key 合并覆盖默认项（{ key, hidden: true } 可关掉单项）；完全自定义请用 function 或 { replace: true, list }
 * - function({ defaultActions, ... }) => list：完全控制
 * - object：{ list, replace?, ...ButtonGroupProps }；replace 为 true 时用 list 替换默认，否则按 key 合并
 */
export const Actions = ({ selectedEntries, index, currentPath, actions, onAction, className, buttonGroupProps }) => {
  const { formatMessage } = useIntl();

  const list = useMemo(() => {
    if (actions === false) {
      return [];
    }

    const ctx = { selectedEntries, index, currentPath, onAction, formatMessage };
    const defaults = getDefaultActions(ctx);
    if (typeof actions === 'function') {
      return normalizeActionList(actions({ ...ctx, defaultActions: defaults }));
    }
    if (Array.isArray(actions)) {
      return mergeActionList(defaults, actions);
    }
    if (actions && typeof actions === 'object') {
      if (actions.replace === true) {
        return normalizeActionList(actions.list);
      }
      if (Array.isArray(actions.list)) {
        return mergeActionList(defaults, actions.list);
      }
    }
    return defaults;
  }, [actions, currentPath, formatMessage, index, onAction, selectedEntries]);

  if (!list.length) {
    return null;
  }

  const extraGroupProps = actions && typeof actions === 'object' && !Array.isArray(actions) && typeof actions !== 'function' ? Object.assign({}, actions) : {};
  delete extraGroupProps.list;
  delete extraGroupProps.replace;

  return (
    <div className={classnames(style['properties-actions'], className)}>
      <ButtonGroup
        size="small"
        compact
        moreType="default"
        placement="bottomLeft"
        menuClassName={style['properties-actions-menu']}
        showLength={2}
        {...buttonGroupProps}
        {...extraGroupProps}
        list={list.map(item =>
          Object.assign({}, item, {
            size: item.size || 'small',
            type: item.type || 'text'
          })
        )}
      />
    </div>
  );
};

export const Default = ({ selectedEntries, index, currentPath, extraInfo, extraSections, actions, onAction, buttonGroupProps }) => {
  const { formatMessage } = useIntl();

  if (!selectedEntries?.length) {
    return null;
  }

  const actionsNode = <Actions selectedEntries={selectedEntries} index={index} currentPath={currentPath} actions={actions} onAction={onAction} buttonGroupProps={buttonGroupProps} />;

  if (selectedEntries.length === 1) {
    const entry = selectedEntries[0];
    const typeLabel = getEntryTypeLabel(entry, formatMessage);
    const childCounts = entry.kind === 'folder' ? countDirectChildren(entry.path, index) : null;
    const subtitle = entry.kind === 'folder' ? formatFolderSubtitle(childCounts.folders, childCounts.files, formatMessage) : `${typeLabel} - ${formatByteSize(entry.size)}`;

    const createdAt = formatDateTime(entry.createdAt || entry.options?.createdAt);
    const updatedAt = formatDateTime(entry.updatedAt || entry.options?.updatedAt);
    const lastOpenedAt = formatDateTime(entry.lastOpenedAt || entry.options?.lastOpenedAt);
    const extraInfoNode = typeof extraInfo === 'function' ? extraInfo({ entry, selectedEntries, index }) : extraInfo;
    const extraSectionsNode = typeof extraSections === 'function' ? extraSections({ entry, selectedEntries, index }) : extraSections;

    return (
      <div className={style['properties-default']}>
        <div className={style['properties-hero']}>
          <div className={style['properties-hero-icon']}>
            <EntryIcon entry={entry} size="xl" />
          </div>
          <div className={style['properties-name']} title={entry.name}>
            {entry.name}
          </div>
          <div className={style['properties-subtitle']}>{subtitle}</div>
        </div>
        {actionsNode}
        <Section title={formatMessage({ id: 'FileSystem.propertiesInfo' })}>
          <InfoRow label={formatMessage({ id: 'FileSystem.propertiesKind' })} value={entry.kind === 'folder' ? formatMessage({ id: 'FileSystem.folder' }) : typeLabel} />
          {entry.kind === 'folder' ? (
            <>
              {childCounts.folders > 0 ? <InfoRow label={formatMessage({ id: 'FileSystem.propertiesFolderCount' })} value={formatMessage({ id: 'FileSystem.propertiesCountValue' }, { count: childCounts.folders })} /> : null}
              {childCounts.files > 0 ? <InfoRow label={formatMessage({ id: 'FileSystem.propertiesFileCount' })} value={formatMessage({ id: 'FileSystem.propertiesCountValue' }, { count: childCounts.files })} /> : null}
            </>
          ) : (
            <InfoRow label={formatMessage({ id: 'FileSystem.columnSize' })} value={formatByteSize(entry.size)} />
          )}
          <InfoRow label={formatMessage({ id: 'FileSystem.propertiesCreatedAt' })} value={createdAt} />
          <InfoRow label={formatMessage({ id: 'FileSystem.propertiesUpdatedAt' })} value={updatedAt} />
          <InfoRow label={formatMessage({ id: 'FileSystem.propertiesLastOpenedAt' })} value={lastOpenedAt} />
          <InfoRow label={formatMessage({ id: 'FileSystem.propertiesPath' })} value={entry.path} />
          {extraInfoNode}
        </Section>
        {extraSectionsNode}
      </div>
    );
  }

  const { folders, files } = summarizeSelection(selectedEntries);
  const countParts = formatCountParts(folders, files, formatMessage);
  const multiSummary =
    countParts.length > 0
      ? formatMessage({ id: 'FileSystem.propertiesMultiSummary' }, { total: selectedEntries.length, detail: countParts.join(formatMessage({ id: 'FileSystem.propertiesCountSeparator' })) })
      : formatMessage({ id: 'FileSystem.selectedCount' }, { count: selectedEntries.length });
  const extraInfoNode = typeof extraInfo === 'function' ? extraInfo({ selectedEntries, index }) : extraInfo;
  const extraSectionsNode = typeof extraSections === 'function' ? extraSections({ selectedEntries, index }) : extraSections;

  return (
    <div className={style['properties-default']}>
      <div className={style['properties-hero']}>
        <div className={style['properties-multi']}>{multiSummary}</div>
      </div>
      {actionsNode}
      <Section title={formatMessage({ id: 'FileSystem.propertiesInfo' })}>
        {folders > 0 ? <InfoRow label={formatMessage({ id: 'FileSystem.propertiesFolderCount' })} value={formatMessage({ id: 'FileSystem.propertiesCountValue' }, { count: folders })} /> : null}
        {files > 0 ? <InfoRow label={formatMessage({ id: 'FileSystem.propertiesFileCount' })} value={formatMessage({ id: 'FileSystem.propertiesCountValue' }, { count: files })} /> : null}
        {extraInfoNode}
      </Section>
      {extraSectionsNode}
    </div>
  );
};

const PropertiesPanel = ({ selectedEntries, index, currentPath, propertiesPanel, propertiesActions, onPropertiesAction, onClose, className }) => {
  const body =
    typeof propertiesPanel === 'function' ? (
      propertiesPanel({
        selectedEntries,
        index,
        currentPath,
        close: onClose,
        actions: propertiesActions,
        onAction: onPropertiesAction,
        defaultActions: getDefaultActions
      })
    ) : propertiesPanel && propertiesPanel !== true ? (
      propertiesPanel
    ) : (
      <Default selectedEntries={selectedEntries} index={index} currentPath={currentPath} actions={propertiesActions} onAction={onPropertiesAction} />
    );

  if (body == null) {
    return null;
  }

  return (
    <aside className={classnames(style['properties-panel'], className)}>
      <div className={style['properties-panel-body']}>{body}</div>
    </aside>
  );
};

PropertiesPanel.Default = Default;
PropertiesPanel.InfoRow = InfoRow;
PropertiesPanel.Section = Section;
PropertiesPanel.Actions = Actions;
PropertiesPanel.getDefaultActions = getDefaultActions;
PropertiesPanel.countDirectChildren = countDirectChildren;
PropertiesPanel.summarizeSelection = summarizeSelection;
PropertiesPanel.getEntryTypeLabel = getEntryTypeLabel;
PropertiesPanel.formatFolderSubtitle = formatFolderSubtitle;

export { Default as DefaultPropertiesContent, Section as PropertiesSection };
export default PropertiesPanel;
