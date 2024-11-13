const downloadAction = (url, filename) => {
  const element = document.createElement('a'),
    event = new MouseEvent('click');
  element.download = filename; // 设置文件名称
  element.href = url; // 将生成的URL设置为a.href属性
  element.dispatchEvent(event); // 触发a的单击事件
};

export default downloadAction;
