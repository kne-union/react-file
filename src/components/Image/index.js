import React from 'react';
import Fetch from '@kne/react-fetch';
import withOSSFile from '../../hocs/withOSSFile';
import classnames from 'classnames';
import { Avatar, Skeleton } from 'antd';
import loadImage from './loadImage';
import useStaticUrl from '../../common/useStaticUrl';
import style from './style.module.scss';
import { ReactComponent as PhotoFail } from './photo-fail.svg';
import { ReactComponent as AvatarDefault } from './avatar-default.svg';
import { ReactComponent as AvatarFemale } from './avatar-female.svg';
import { ReactComponent as AvatarMale } from './avatar-male.svg';
import { usePreset } from '@kne/global-context';

const loadingElement = <Skeleton.Avatar shape="square" active />;
const photoFail = <PhotoFail />;
const avatarDefault = <AvatarDefault />;
const avatarFemale = <AvatarFemale />;
const avatarMale = <AvatarMale />;

const ImageInner = ({
                      data,
                      className,
                      alt,
                      innerLoading,
                      loading,
                      error,
                      innerError,
                      children,
                      onClick,
                      staticUrl: staticUrlProps
                    }) => {
  const { apis: baseApis } = usePreset();
  const apis = Object.assign({}, baseApis);
  const fileUrl = useStaticUrl({ staticUrl: staticUrlProps || apis.file?.staticUrl, url: data });
  return (<Fetch
    loader={loadImage}
    params={{ data: fileUrl }}
    error={innerError || error}
    loading={innerLoading || loading}
    render={({ data }) => {
      if (typeof children === 'function') {
        return children({
          alt, className: classnames(className, style['img']), src: data
        });
      }
      return <img alt={alt} className={classnames(className, style['img'])} src={data} onClick={onClick} />;
    }}
  />);
};

const FetchImageInner = withOSSFile(ImageInner);

const renderInner = ({ loading, error, src, id, alt, className, children, apis, onClick, staticUrl }) => {
  const cloneElement = (element, props) => {
    const TypeElement = element.type;
    if (!TypeElement && element.render) {
      return element.render(Object.assign({}, element.props, props));
    }
    return <TypeElement {...Object.assign({}, element.props, props)} />;
  };
  const imageLoading = loading && cloneElement(loading, {
    className: style['loading']
  });
  const imageError = error && cloneElement(error, {
    className: style['error']
  });

  if (id) {
    return (<FetchImageInner alt={alt} className={className} id={id} loading={imageLoading} innerLoading={imageLoading}
                             error={imageError} innerError={imageError} apis={apis} onClick={onClick}>
      {children}
    </FetchImageInner>);
  }

  if (src) {
    return (<ImageInner alt={alt} className={className} staticUrl={staticUrl} data={src} loading={imageLoading}
                        error={imageError} onClick={onClick}>
      {children}
    </ImageInner>);
  }

  return imageError;
};

const Image = p => {
  const {
    id, src, alt, onClick, loading, error, className, apis, staticUrl, ...props
  } = Object.assign({}, { loading: loadingElement, error: photoFail }, p);
  return (<div {...props} className={classnames(className, style['img-outer'])}>
    {renderInner({
      loading, error, src, id, alt, className, apis, onClick, staticUrl
    })}
  </div>);
};

Image.Avatar = p => {
  const {
    id,
    src,
    alt,
    gender,
    loading,
    error,
    className,
    gap,
    icon,
    children,
    shape: propsShape,
    size,
    width,
    height,
    defaultAvatar,
    apis,
    staticUrl,
    ...props
  } = Object.assign({}, {
    size: 100, defaultAvatar: avatarDefault, error: photoFail, shape: 'circle'
  }, p);
  const inner = (() => {
    const styleProps = width && height ? { style: { width, height } } : { size };
    let shape = propsShape;
    if (width && width !== height) {
      shape = 'square';
    }

    if (id || src) {
      return renderInner({
        loading: loading || <Skeleton.Avatar shape={shape} active />,
        staticUrl,
        error,
        src,
        defaultAvatar,
        id,
        alt,
        className,
        apis,
        children: props => <Avatar {...props} gap={gap} shape={shape} {...styleProps} />
      });
    }

    if (gender) {
      const type = (() => {
        if (['F', 'female', 'f'].indexOf(gender) > -1) {
          return avatarFemale;
        }
        if (['M', 'male', 'm'].indexOf(gender) > -1) {
          return avatarMale;
        }

        return avatarDefault;
      })();

      return <Avatar {...props} src={type} gap={gap} shape={shape} {...styleProps} />;
    }

    return (<Avatar {...props} gap={gap} icon={icon} shape={shape} size={size} src={defaultAvatar} {...styleProps}>
      {children}
    </Avatar>);
  })();

  return (<div
    {...props}
    className={classnames(className, style['img-outer'])}
    style={{
      width: width && height ? width : size, height: width && height ? height : size
    }}
  >
    {inner}
  </div>);
};

export default Image;
