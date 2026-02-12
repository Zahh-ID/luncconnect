declare module "@goblinhunt/cosmes" {
    export function createSigner(options: any): any;
    export class BroadcastTxError extends Error {}
    export class BroadcastTxSuccess {}
    // Add other exports if needed
}
