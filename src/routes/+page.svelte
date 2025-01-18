<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { createListing, destroyListing } from '$lib/shared/contract.tools';
  import { appState } from '$lib/shared/app.state.svelte';
  import { untrack } from 'svelte';

  // Mock data for projects
  const projects = [
    {
      title: 'Project 1',
      description: 'Description for project 1',
      tags: ['React', 'TypeScript'],
      comments: 5,
      upvotes: 10
    },
    {
      title: 'Project 2',
      description: 'Description for project 2',
      tags: ['Svelte', 'JavaScript'],
      comments: 3,
      upvotes: 7
    },
    {
      title: 'Project 3',
      description: 'Description for project 3',
      tags: ['Python', 'AI'],
      comments: 8,
      upvotes: 15
    }
  ];

  const handleCreateListing = async () => {
    await createListing();
  };

  const handleDestroyListing = async () => {
    await destroyListing(
      '0xbf338e5e3366ea00796ed69e41c1967aec6d1137685b6c49da08594992db4eb7'
    );
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

<Button onclick={handleCreateListing}>Create</Button>
<Button onclick={handleDestroyListing}>Destroy</Button>
<Button onclick={appState.getListings}>Get Listings</Button>

<div class="container mx-auto p-4">
  <div class="mb-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="h-12 w-12 rounded-full bg-gray-200"></div>
      <div class="space-x-4">
        <Button variant="ghost" class="px-0">My Projects</Button>
        <Button variant="ghost" class="px-0">Ratings</Button>
      </div>
    </div>
    <ConnectButton {walletAdapter} />
  </div>

  <div class="divide-y rounded-lg border">
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
</div>
