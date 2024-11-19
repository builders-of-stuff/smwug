<script lang="ts">
  import { Card, CardContent } from '$lib/components/ui/card';

  let { uploads } = $props<{
    uploads: Array<{
      info: any;
      mediaType: string;
      blobUrl: string;
      suiUrl: string;
    }>;
  }>();

  const SUI_NETWORK = 'testnet';
  const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;
</script>

<div class="space-y-4">
  {#each uploads as upload}
    <Card>
      <CardContent class="flex gap-4 p-4">
        {#if upload.mediaType.startsWith('image')}
          <div class="w-1/3">
            <img
              src={upload.blobUrl}
              alt="Uploaded content"
              class="h-auto w-full rounded object-cover"
            />
          </div>
        {/if}

        <div class="flex-1 space-y-2">
          <div>
            <span class="text-sm text-muted-foreground">Status:</span>
            <span>{upload.info.status}</span>
          </div>

          <div>
            <span class="text-sm text-muted-foreground">Blob ID:</span>
            <a href={upload.blobUrl} class="break-all underline">{upload.info.blobId}</a
            >
          </div>

          <div>
            <span class="text-sm text-muted-foreground">{upload.info.suiRefType}:</span>
            <a href={upload.suiUrl} target="_blank" class="break-all underline">
              {upload.info.suiRef}
            </a>
          </div>

          <div>
            <span class="text-sm text-muted-foreground">Stored until epoch:</span>
            <span>{upload.info.endEpoch}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  {/each}
</div>
