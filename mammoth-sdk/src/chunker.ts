const CHUNK_SIZE = 256 * 1024; // 256KB

export function chunkFile(buffer: Buffer): Buffer[] {
  const chunks: Buffer[] = [];
  for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
    chunks.push(buffer.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
}