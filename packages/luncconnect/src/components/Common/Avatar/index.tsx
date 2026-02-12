import React from 'react';

import { EnsAvatar } from './styles';

import { ResetContainer } from '../../../styles';
import { useContext } from '../../ConnectKit';
import useIsMounted from '../../../hooks/useIsMounted';

export type CustomAvatarProps = {
  address?: string | undefined;
  ensName?: string | undefined;
  ensImage?: string;
  size: number;
  radius: number;
};

const Avatar: React.FC<{
  address?: string | undefined;
  name?: string | undefined;
  size?: number;
  radius?: number;
}> = ({ address, name, size = 96, radius = 96 }) => {
  const isMounted = useIsMounted();
  const context = useContext();

  if (!isMounted)
    return <div style={{ width: size, height: size, borderRadius: radius }} />;

  if (context.options?.customAvatar)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        {context.options?.customAvatar({
          address: address,
          ensName: name,
          ensImage: undefined,
          size,
          radius,
        })}
      </div>
    );

  return (
    <ResetContainer style={{ pointerEvents: 'none' }}>
      <EnsAvatar $size={size} $seed={address} $radius={radius} />
    </ResetContainer>
  );
};

export default Avatar;
