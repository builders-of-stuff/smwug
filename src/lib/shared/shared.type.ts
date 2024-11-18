export interface WalrusStorageInfo {
  alreadyCertified?: {
    blobId: string;
    endEpoch: number;
    event: {
      txDigest: string;
    };
  };
  newlyCreated?: {
    blobObject: {
      blobId: string;
      id: string;
      storage: {
        endEpoch: number;
      };
    };
  };
}

export interface ProcessedUploadInfo {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
}

export interface Upload {
  info: ProcessedUploadInfo;
  mediaType: string;
  blobUrl: string;
  suiUrl: string;
}
