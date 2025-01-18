import { getListings } from './contract.tools';
import type { Listing } from './shared.type';

export class AppState {
  hasFetchedListings: boolean = $state(false);
  listings: Listing[] = $state([]);

  constructor() {}

  async getListings() {
    const listings = await getListings();
    this.listings = listings;
    this.hasFetchedListings = true;
  }
}

export const appState = new AppState();
