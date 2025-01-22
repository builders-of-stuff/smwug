<script lang="ts">
  import { untrack } from 'svelte';
  import { slide } from 'svelte/transition';
  import { Button } from '$lib/components/ui/button';
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { createListing } from '$lib/shared/contract.tools';
  import { appState } from '$lib/shared/app.state.svelte';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from '$lib/components/ui/dialog';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { AGGREGATOR_URL, PUBLISHER_URL } from '$lib/shared/shared.constant';

  let isDialogOpen = $state(false);
  let title = $state('');
  let subtitle = $state('');
  let description = $state('');
  let blobId = $state('');
  let fileInput = $state<HTMLInputElement | null>(null);

  let isUploadingToWalrus = $state(false);

  const handleCreateListing = async () => {
    await createListing({
      title,
      subtitle,
      description,
      blobId
    });

    isDialogOpen = false;
    title = '';
    subtitle = '';
    description = '';
    blobId = '';
  };

  const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    try {
      isUploadingToWalrus = true;

      const response = await fetch(`${PUBLISHER_URL}/v1/blobs?epochs=${100}`, {
        method: 'PUT',
        body: file
      });
      const data = await response.json();

      console.log('data: ', data);
      blobId = data?.newlyCreated?.blobObject?.blobId || data?.alreadyCertified?.blobId;
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      isUploadingToWalrus = false;
    }
  };

  /**
   * Fetch listings upon connect
   */
  $effect(() => {
    if (!walletAdapter.isConnected || appState.hasFetchedListings) {
      return;
    }

    untrack(() => {
      (async () => {
        await appState.getListings();
      })();
    });
  });
</script>

<div class="container mx-auto p-4">
  <div class="mb-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="h-12 w-12 rounded-full bg-gray-200"></div>
      <div class="text-2xl font-bold">Show Me What You Got</div>
    </div>
    <div class="flex items-center gap-4">
      <Button variant="ghost" onclick={() => (isDialogOpen = true)}>
        Create listing
      </Button>
      <ConnectButton {walletAdapter} />
    </div>
  </div>

  {#if appState.hasListings}
    <div transition:slide class="divide-y rounded-lg border">
      {#each appState.listings as listing}
        {@const blobId = listing.imageBlobId}
        {@const isLegitBlobId =
          blobId && blobId !== 'null' && blobId !== 'placeholder blob id'}
        {@const blobUrl = `${AGGREGATOR_URL}/v1/blobs/${blobId}`}

        <div
          role="button"
          tabindex="0"
          onclick={() => appState.openListingModal(listing)}
          onkeypress={(e) => e.key === 'Enter' && appState.openListingModal(listing)}
          class="flex cursor-pointer items-center gap-4 p-4 hover:bg-gray-50"
        >
          {#if isLegitBlobId}
            <img
              src={blobUrl}
              alt={'thumbnail'}
              class="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          {:else}
            <div class="h-16 w-16 shrink-0 rounded-lg bg-gray-200"></div>
          {/if}
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{listing.title}</h3>
            <p class="text-sm text-gray-600">{listing.subtitle}</p>
            <p class="text-sm text-gray-500">{listing.description}</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 text-gray-500">
              <span class="i-lucide-message-square text-lg" />
              <span>{listing.comments}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <span class="i-lucide-arrow-up text-lg" />
              <span>{listing.upvotes.length}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Dialog bind:open={isDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Listing</DialogTitle>
      <DialogDescription>
        Fill out the form below to create a new listing.
      </DialogDescription>
    </DialogHeader>

    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label for="title">Title</Label>
        <Input id="title" bind:value={title} placeholder="Enter listing title" />
      </div>
      <div class="grid gap-2">
        <Label for="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          bind:value={subtitle}
          placeholder="Enter listing subtitle"
        />
      </div>
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          bind:value={description}
          placeholder="Enter listing description"
        />
      </div>
      <div class="grid gap-2">
        <Label for="file">Upload File</Label>
        <input
          id="file"
          type="file"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          bind:this={fileInput}
          onchange={handleFileUpload}
          accept="image/*,video/*,audio/*"
        />
        {#if blobId}
          <p class="text-sm text-green-600">
            File uploaded successfully! Blob ID: {blobId}
          </p>
        {/if}
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onclick={() => (isDialogOpen = false)}>Cancel</Button>
      <Button disabled={isUploadingToWalrus || !title} onclick={handleCreateListing}>
        {#if isUploadingToWalrus}
          Uploading...
        {:else}
          Create
        {/if}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<!-- Listing Detail Modal -->
<Dialog
  open={appState.selectedListing !== null}
  onOpenChange={(open) => !open && appState.closeListingModal()}
>
  <DialogContent class="sm:max-w-2xl">
    {#if appState.selectedListing}
      <DialogHeader>
        <DialogTitle class="text-3xl font-bold"
          >{appState.selectedListing.title}</DialogTitle
        >
        <DialogDescription class="text-xl"
          >{appState.selectedListing.subtitle}</DialogDescription
        >
      </DialogHeader>

      <div class="space-y-4 py-4">
        {#if appState.selectedListing.imageBlobId && appState.selectedListing.imageBlobId !== 'null' && appState.selectedListing.imageBlobId !== 'placeholder blob id'}
          <img
            src={`${AGGREGATOR_URL}/v1/blobs/${appState.selectedListing.imageBlobId}`}
            alt={appState.selectedListing.title}
            class="w-full rounded-lg object-cover"
          />
        {/if}
        <p class="text-gray-600">{appState.selectedListing.description}</p>

        <div class="flex gap-2">
          <Button
            variant={appState.isUpvoted ? 'default' : 'outline'}
            onclick={() =>
              appState.selectedListing &&
              walletAdapter.currentAccount &&
              appState.upvoteDownvoteListing(
                appState.selectedListing?.id,
                appState.selectedListing?.yearMonth,
                walletAdapter.currentAccount?.address
              )}
          >
            ↑ {appState.listings.find((l) => l.id === appState.selectedListing?.id)
              ?.upvotes.length ?? appState.selectedListing?.upvotes.length}
          </Button>

          {#if walletAdapter.currentAccount?.address === appState.selectedListing.owner}
            <Button
              variant="destructive"
              onclick={() => appState.deleteSelectedListing()}
            >
              Delete
            </Button>
          {/if}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onclick={() => appState.closeListingModal()}>
          Close
        </Button>
      </DialogFooter>
    {/if}
  </DialogContent>
</Dialog>
