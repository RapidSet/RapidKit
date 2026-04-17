import { IconProps } from './types';

export const Icon = (props: IconProps) => {
  const { icon, className, ...rest } = props;
  const IconComponent = 'default' in icon ? icon.default : icon;

  return <IconComponent className={className} {...rest} />;
};
