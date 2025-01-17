<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';

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
</script>

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
    {#each projects as project}
      <div class="flex items-center gap-4 p-4 hover:bg-gray-50">
        <div class="h-16 w-16 shrink-0 rounded-lg bg-gray-200"></div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold">{project.title}</h3>
          <p class="text-sm text-gray-500">{project.description}</p>
          <div class="mt-2 flex gap-2">
            {#each project.tags as tag}
              <Badge
                variant="secondary"
                class="rounded-md bg-gray-100 text-gray-700 hover:bg-gray-100"
                >{tag}</Badge
              >
            {/each}
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-gray-500">
            <span class="i-lucide-message-square text-lg" />
            <span>{project.comments}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <span class="i-lucide-arrow-up text-lg" />
            <span>{project.upvotes}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
