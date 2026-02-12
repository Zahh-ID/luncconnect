import React from 'react';
interface AvatarProps {
    address: string;
    size?: number;
}
/**
 * A simple, colorful avatar generated from the address.
 * Mimics the ConnectKit/RainbowKit feel.
 */
export declare const Avatar: React.FC<AvatarProps>;
export {};
