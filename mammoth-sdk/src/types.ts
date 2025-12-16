export type MammothConfig = {
  rpcUrl: string;
  contractAddress: string;
  nodes: string[];
};

export type StoreParams = {
  file: Buffer | File | Blob;
  replicas: number;
  duration?: number;
  payment: string; // e.g. "0.03" BDAG native currency
};