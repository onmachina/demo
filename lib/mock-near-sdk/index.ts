// Buffer polyfill needed by `near-api-js`: "Buffer is not defined" exception.
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

// Export the required CSS.
import '@near-wallet-selector/modal-ui/styles.css';

// Export the required modules.
export * from './client';
