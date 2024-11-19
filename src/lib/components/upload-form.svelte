<script lang="ts">
  import { Loader2 } from 'lucide-svelte';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { uploadStore } from '$lib/stores/upload-store';
  import { AGGREGATOR_URL, PUBLISHER_URL } from '$lib/shared/shared.constant';

  let { handleUpload } = $props();

  let publisherUrl = $state(PUBLISHER_URL);
  let aggregatorUrl = $state(AGGREGATOR_URL);
  let epochs = $state(1);
  let selectedFile = $state<File | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!selectedFile) {
      $uploadStore.error = 'Please select a file';
      return;
    }

    $uploadStore.isUploading = true;
    $uploadStore.error = null;

    try {
      const response = await fetch(`${publisherUrl}/v1/store?epochs=${epochs}`, {
        method: 'PUT',
        body: selectedFile
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      const info = await response.json();

      handleUpload({
        info,
        mediaType: selectedFile.type
      });

      // Reset form
      selectedFile = null;
      const form = event.target as HTMLFormElement;
      form.reset();
    } catch (error) {
      console.error('Upload error:', error);
      $uploadStore.error =
        error instanceof Error ? error.message : 'Failed to upload file';
    } finally {
      $uploadStore.isUploading = false;
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('target: ', target.files);
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
      console.log('File selected:', selectedFile.name); // Debug log
    } else {
      selectedFile = null;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div class="grid gap-4">
    <div class="grid gap-2">
      <Label for="publisher-url">Publisher URL</Label>
      <Input
        id="publisher-url"
        bind:value={publisherUrl}
        placeholder="https://publisher.walrus-testnet.walrus.space"
        required
      />
    </div>

    <div class="grid gap-2">
      <Label for="aggregator-url">Aggregator URL</Label>
      <Input
        id="aggregator-url"
        bind:value={aggregatorUrl}
        placeholder="https://aggregator.walrus-testnet.walrus.space"
        required
      />
    </div>

    <div class="grid gap-2">
      <Label for="file">File (Max 10 MiB)</Label>
      <Input
        id="file"
        name="file"
        type="file"
        accept="image/*"
        onchange={handleFileChange}
        required
      />
    </div>

    <div class="grid gap-2">
      <Label for="epochs">Epochs</Label>
      <Input id="epochs" type="number" bind:value={epochs} min="1" required />
      <p class="text-sm text-muted-foreground">
        The number of Walrus epochs for which to store the blob.
      </p>
    </div>
  </div>

  <Button type="submit" disabled={$uploadStore.isUploading || !selectedFile}>
    {#if $uploadStore.isUploading}
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Uploading...
    {:else}
      Upload
    {/if}
  </Button>
</form>

{#if $uploadStore.error}
  <Alert variant="destructive" class="mt-4">
    <AlertDescription>{$uploadStore.error}</AlertDescription>
  </Alert>
{/if}

{#if selectedFile}
  <p class="mt-2 text-sm text-muted-foreground">
    Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
  </p>
{/if}
