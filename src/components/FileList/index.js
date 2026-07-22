import { List as AntdList, Modal, Space, Spin, Typography } from 'antd';
import FileType from '@kne/react-file-type';
import { OptionButtonsInner } from './OptionButtons';
import last from 'lodash/last';
import dayjs from 'dayjs';
import classnames from 'classnames';
import style from './style.module.scss';
import withLocale from '../../withLocale';
import { useIntl } from '@kne/react-intl';

const ListInner = p => {
  const { formatMessage } = useIntl();
  const { className, dataSource, getPermission, infoItemRenders, onDelete, onEdit, apis, renderModal } = Object.assign(
    {},
    {
      infoItemRenders: [
        item => {
          return item.userName ? <Typography.Text>{item.userName}</Typography.Text> : null;
        },
        item => {
          return item.date ? <Typography.Text>{dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text> : null;
        }
      ],
      getPermission: () => {
        return true;
      },
      renderModal: modalProps => <Modal {...Object.assign({}, modalProps)} />
    },
    p
  );

  return (
    <AntdList
      className={classnames(className, style['file-list'])}
      dataSource={dataSource.map((item, index) => ({ ...item, index }))}
      rowKey={item => `item_${(item.uuid && `uuid_${item.uuid}`) || (item.id && `id_${item.id}`) || (item.src && `src_${item.src}`)}`}
      renderItem={item => {
        const { type, filename } = item;
        const metaNodes =
          infoItemRenders &&
          infoItemRenders
            .map((render, index) => {
              if (type === 'uploading') {
                return null;
              }
              const content = (typeof render === 'function' ? render : render.render)(item);
              if (!content) {
                return null;
              }
              return (
                <div className={style['item-meta-cell']} key={index} style={render.span ? { flex: `0 0 ${(render.span / 24) * 100}%` } : undefined}>
                  {content}
                </div>
              );
            })
            .filter(Boolean);

        return (
          <AntdList.Item className={style['list-item-outer']}>
            <div className={style['list-item']}>
              <div className={style['item-icon']}>
                <FileType type={last(filename?.split('.'))} size={28} />
              </div>
              <div className={style['item-content']}>
                <div className={style['item-filename']} title={filename || ''}>
                  {filename || ''}
                </div>
                {metaNodes?.length > 0 ? <div className={style['item-meta']}>{metaNodes}</div> : null}
              </div>
              <div className={style['list-options']}>
                {type !== 'uploading' ? (
                  <OptionButtonsInner getPermission={getPermission} item={item} apis={apis} onDelete={onDelete} renderModal={renderModal} onEdit={onEdit} />
                ) : (
                  <Space className={style['loading']}>
                    <Spin size="small" />
                    <Typography.Link>{formatMessage({ id: 'FileList.uploading' })}</Typography.Link>
                  </Space>
                )}
              </div>
            </div>
          </AntdList.Item>
        );
      }}
      bordered
    />
  );
};

const List = withLocale(ListInner);

export { ListInner };
export { default as OptionButtons } from './OptionButtons';
export default List;
