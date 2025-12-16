# Mammoth Node

Simple Express server that stores blobs by hash and serves them on request.

## Run (Monorepo Root)
- `npm run node:start`
- Server listens on `http://localhost:8080` by default.

## API
- `POST /storeBlob`
  - Body: `{ hash: string, data: string }` where `data` is base64-encoded bytes
  - Response: `{ success: true, hash }`
- `GET /getBlob/:hash`
  - Returns raw bytes for stored blob or 404 if not found

## Test Manually
1. Start server: `npm run node:start`
2. Store a blob:
   ```bash
   curl -X POST http://localhost:8080/storeBlob \
     -H "Content-Type: application/json" \
     -d '{"hash":"abc123","data":"aGVsbG8gd29ybGQ="}'
   ```
3. Retrieve it:
   ```bash
   curl http://localhost:8080/getBlob/abc123 -o output.bin
   ```
4. Verify `output.bin` contents are `hello world`.

## Storage Directory
- Files are stored under `mammoth-node/storage/` using the provided hash as filename.