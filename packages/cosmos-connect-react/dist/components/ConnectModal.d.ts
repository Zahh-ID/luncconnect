import React from 'react';
interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export type ModalRoute = 'connectors' | 'about' | 'profile' | 'connecting';
export declare const ConnectModal: React.FC<ConnectModalProps>;
export {};
