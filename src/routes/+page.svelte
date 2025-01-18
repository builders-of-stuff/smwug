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

  const handleCreateListing = async () => {
    await createListing();
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
      <Button variant="ghost" class="">Create listing</Button>
      <ConnectButton {walletAdapter} />
    </div>
  </div>

  {#if appState.hasListings}
    <div transition:slide class="divide-y rounded-lg border">
      {#each appState.listings as listing}
        <div class="flex items-center gap-4 p-4 hover:bg-gray-50">
          <div class="h-16 w-16 shrink-0 rounded-lg bg-gray-200"></div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{listing.title}</h3>
            <p class="text-sm text-gray-500">{listing.description}</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2 text-gray-500">
              <span class="i-lucide-message-square text-lg" />
              <span>{listing.comments}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <span class="i-lucide-arrow-up text-lg" />
              <span>{listing.upvotes}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
