<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { uploadStore } from '$lib/stores/upload-store';
  import { Loader2 } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    upload: {
      info: any;
      mediaType: string;
    };
  }>();

  let publisherUrl = 'https://publisher.walrus-testnet.walrus.space';
  let aggregatorUrl = 'https://aggregator.walrus-testnet.walrus.space';
  let epochs = 1;
  let selectedFile: File | null = null;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log('Selected file at submit:', selectedFile); // Debug log

    if (!selectedFile) {
      $uploadStore.error = 'Please select a file';
      return;
    }

    $uploadStore.isUploading = true;
    $uploadStore.error = null;

    try {
      console.log('Starting upload for file:', selectedFile.name); // Debug log
      const response = await fetch(`${publisherUrl}/v1/store?epochs=${epochs}`, {
        method: 'PUT',
        body: selectedFile
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      const info = await response.json();
      console.log('Upload successful:', info); // Debug log

      dispatch('upload', {
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
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
      console.log('File selected:', selectedFile.name); // Debug log
    } else {
      selectedFile = null;
    }
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
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
