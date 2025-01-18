import { getListings } from './contract.tools';
import type { Listing } from './shared.type';

export class AppState {
  listings: Listing[] = $state([]);
  hasFetchedListings: boolean = $state(false);
  hasListings: boolean = $derived(this.listings.length > 0);

  constructor() {}

  async getListings() {
    const listings = await getListings();
    this.listings = listings;
    this.hasFetchedListings = true;
  }
}

export const appState = new AppState();
