import React from 'react';
import { Col, List as AntdList, Modal, Row, Space, Spin, Typography } from 'antd';
import FileType from '@kne/react-file-type';
import OptionButtons from './OptionButtons';
import last from 'lodash/last';
import dayjs from 'dayjs';
import style from './style.module.scss';
import { useContext } from '@kne/global-context';

const List = p => {
  const { locale: contextLocale } = useContext();
  const locale = Object.assign(
    {},
    {
      正在上传: '正在上传'
    },
    contextLocale,
    p.locale
  );
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
    p,
    { locale }
  );
  return (
    <AntdList
      className={className}
      dataSource={dataSource.map((item, index) => {
        item.index = index;
        return item;
      })}
      rowKey={item => `item_${(item.uuid && `uuid_${item.uuid}`) || (item.id && `id_${item.id}`) || (item.src && `src_${item.src}`)}`}
      renderItem={item => {
        const { type, filename } = item;
        return (
          <AntdList.Item className={style['list-item-outer']}>
            <Row justify="space-between" wrap={false} className={style['list-item']}>
              <Col flex={1}>
                <div className={style['split']} />
                <Space className="is-block" align="start" size={4}>
                  <FileType type={last(filename?.split('.'))} size={14} />
                  {filename || ''}
                </Space>
              </Col>
              {infoItemRenders &&
                infoItemRenders.map((render, index) => {
                  return (
                    <Col span={render.span || 4} key={index}>
                      {type !== 'uploading' && (typeof render === 'function' ? render : render.render)(item)}
                      <div className={style['split']} />
                    </Col>
                  );
                })}
              <Col className={style['list-options']}>
                {type !== 'uploading' ? (
                  <OptionButtons getPermission={getPermission} item={item} apis={apis} onDelete={onDelete} renderModal={renderModal} onEdit={onEdit} />
                ) : (
                  <Space className={style['loading']}>
                    <Spin size="small" />
                    <Typography.Link>{locale['正在上传']}</Typography.Link>
                  </Space>
                )}
              </Col>
            </Row>
          </AntdList.Item>
        );
      }}
      bordered
    />
  );
};

export default List;

export { OptionButtons };
