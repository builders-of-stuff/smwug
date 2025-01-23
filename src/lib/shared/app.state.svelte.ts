import { destroyListing, getListings, upvoteListing } from './contract.tools';
import type { Listing } from './shared.type';

export class AppState {
  listings: Listing[] = $state([]);
  hasFetchedListings: boolean = $state(false);
  hasListings: boolean = $derived(this.listings?.length > 0);
  selectedListing: Listing | null = $state(null);
  isUpvoted: boolean = $state(false);

  constructor() {}

  async getListings() {
    const listings = await getListings();
    this.listings = listings;
    this.hasFetchedListings = true;
  }

  addListing(listing: Listing) {
    this.listings.push(listing);
  }

  getListing(listingId: string) {
    return this.listings.find((listing) => listing.id === listingId);
  }

  async deleteListing(listingId: string, yearMonth: string) {
    await destroyListing(listingId, yearMonth);
    this.listings = this.listings.filter((listing) => listing.id !== listingId);
  }

  async upvoteDownvoteListing(
    listingId: string,
    yearMonth: string,
    senderAddress: string
  ) {
    await upvoteListing(listingId, yearMonth);
    this.listings = this.listings.map((listing) => {
      if (listing.id === listingId) {
        const hasUpvoted = listing.upvotes.includes(senderAddress);
        const upvotes = hasUpvoted
          ? listing.upvotes.filter((addr) => addr !== senderAddress)
          : [...listing.upvotes, senderAddress];
        return { ...listing, upvotes };
      }
      return listing;
    });
  }

  openListingModal(listing: Listing) {
    this.selectedListing = listing;
    this.isUpvoted = false;
  }

  closeListingModal() {
    this.selectedListing = null;
  }

  async deleteSelectedListing() {
    if (!this.selectedListing) return;
    await this.deleteListing(this.selectedListing.id, this.selectedListing.yearMonth);
    this.closeListingModal();
  }
}

export const appState = new AppState();
