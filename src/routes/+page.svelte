<script lang="ts">
  import UploadForm from '$lib/components/UploadForm.svelte';
  import UploadsList from '$lib/components/UploadsList.svelte';

  let uploads: Array<any> = [];

  function handleUpload(event: CustomEvent) {
    const { info, mediaType } = event.detail;

    const processedInfo = processUploadInfo(info);
    const baseAggregatorUrl = 'https://aggregator.walrus-testnet.walrus.space';
    const blobUrl = `${baseAggregatorUrl}/v1/${processedInfo.blobId}`;
    const suiUrl = `${processedInfo.suiBaseUrl}/${processedInfo.suiRef}`;

    uploads = [
      {
        info: processedInfo,
        mediaType,
        blobUrl,
        suiUrl
      },
      ...uploads
    ];
  }

  function processUploadInfo(storageInfo: any) {
    const SUI_NETWORK = 'testnet';
    const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
    const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

    if ('alreadyCertified' in storageInfo) {
      return {
        status: 'Already certified',
        blobId: storageInfo.alreadyCertified.blobId,
        endEpoch: storageInfo.alreadyCertified.endEpoch,
        suiRefType: 'Previous Sui Certified Event',
        suiRef: storageInfo.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL
      };
    } else if ('newlyCreated' in storageInfo) {
      return {
        status: 'Newly created',
        blobId: storageInfo.newlyCreated.blobObject.blobId,
        endEpoch: storageInfo.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: 'Associated Sui Object',
        suiRef: storageInfo.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL
      };
    } else {
      throw Error('Unhandled successful response!');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="mb-2 text-4xl font-bold">Walrus Blob Upload</h1>
    <p class="text-xl text-muted-foreground">
      An example uploading and displaying files with Walrus.
    </p>
  </header>

  <div class="grid gap-8 lg:grid-cols-2">
    <section>
      <h2 class="mb-4 text-2xl font-semibold">Blob Upload</h2>
      <p class="mb-4 text-muted-foreground">
        Upload blobs to Walrus, and display them on this page. See the
        <a href="https://docs.walrus.site" target="_blank" class="underline">
          Walrus documentation
        </a>
        for more information. The file size is limited to 10 MiB on the default publisher.
        Use the
        <a
          href="https://docs.walrus.site/usage/client-cli.html"
          target="_blank"
          class="underline"
        >
          CLI tool
        </a>
        to store bigger files.
      </p>

      <UploadForm on:upload={handleUpload} />
    </section>

    <section>
      <h2 class="mb-4 text-2xl font-semibold">Uploaded Blobs</h2>
      <UploadsList {uploads} />
    </section>
  </div>
</div>
