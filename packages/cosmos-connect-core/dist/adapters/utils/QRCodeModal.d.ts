export type MobileAppDetails = {
    name: string;
    android: string;
    ios: string;
    isStation?: boolean;
    isLuncDash?: boolean;
    description?: string;
    url?: string;
    icons?: string[];
    projectId?: string;
};
export declare class QRCodeModal {
    private details;
    constructor(details: MobileAppDetails);
    open(uri: string): void;
    close(): void;
    private getSchemeUri;
    private generateAndroidIntent;
    private generateIosIntent;
}
