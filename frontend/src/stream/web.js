// Stream/web polyfill for browser compatibility
import { Readable, Writable, Transform } from 'readable-stream';

export {
  Readable,
  Writable, 
  Transform,
  Readable as ReadableStream,
  Writable as WritableStream,
  Transform as TransformStream
};

// Add any other stream/web exports that might be needed
export default {
  Readable,
  Writable,
  Transform,
  ReadableStream: Readable,
  WritableStream: Writable,
  TransformStream: Transform
};