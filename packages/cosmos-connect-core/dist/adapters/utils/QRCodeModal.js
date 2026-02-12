import { isAndroid, isMobile } from "./os.js";
export class QRCodeModal {
    details;
    // Expose URI for external access (monkey-patch hook)
    // Static or instance property? WalletConnectV2 creates a NEW instance each time.
    // So we need a way to extract it.
    // The official QRCodeModal renders to DOM.
    // The WalletConnectWallet adapter will PATCH the prototype or instance.
    constructor(details) {
        this.details = details;
    }
    open(uri) {
        console.log("QRCodeModalStub open called with:", uri);
        // Default behavior is to redirect on mobile
        if (isMobile() && typeof window !== "undefined") {
            const schemeUri = this.getSchemeUri(uri);
            if (this.details.isStation) {
                window.location.href = schemeUri;
            }
            else if (isAndroid()) {
                window.location.href = this.generateAndroidIntent(uri);
            }
            else {
                window.location.href = this.generateIosIntent(uri);
            }
        }
    }
    close() {
        console.log("QRCodeModalStub close called");
    }
    getSchemeUri(uri) {
        return this.details.isStation
            ? this.details.isLuncDash
                ? `luncdash://wallet_connect?${encodeURIComponent(`payload=${encodeURIComponent(uri)}`)}`
                : `https://terrastation.page.link/?link=https://terra.money?${encodeURIComponent(`action=wallet_connect&payload=${encodeURIComponent(uri)}`)}&apn=money.terra.station&ibi=money.terra.station&isi=1548434735`
            : uri;
    }
    generateAndroidIntent(uri) {
        const hashIndex = this.details.android.indexOf("#");
        if (hashIndex === -1)
            return this.details.android;
        return (this.details.android.slice(0, hashIndex) +
            "?" +
            encodeURIComponent(uri) +
            this.details.android.slice(hashIndex));
    }
    generateIosIntent(uri) {
        return this.details.ios + "?" + encodeURIComponent(uri);
    }
}
