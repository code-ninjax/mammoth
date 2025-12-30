export type MammothConfig = {
  rpcUrl: string;
  contractAddress: string;
  nodes: string[];
};

export type StoreParams = {
  file: Buffer | File | Blob;
  payment: string; // e.g. "0.03" BDAG native currency
  // Removed replicas and duration for v1 simplicity as per prompt
};

export type Metadata = {
  fileSize: number;
  chunkCount: number;
  rootHash: string;
  uploader: string;
  fileName?: string;
  mimeType?: string;
};

export type UploadResponse = {
  fileId: string; // Same as rootHash
  txHash: string;
  retrievalEndpoint: string;
};
