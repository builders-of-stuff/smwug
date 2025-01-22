import { testnetWalletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';

import { appState } from '$lib/shared/app.state.svelte';

import { LISTINGS_REGISTRY_ID, PACKAGE_ID } from './shared.constant';
import { formatContractListings, formatListingsCreatedEvent } from './contract.mappers';

const walletAdapter = testnetWalletAdapter;

/**
 * Create listing
 */
export const createListing = async ({
  title,
  subtitle,
  description,
  blobId
}: {
  title: string;
  subtitle: string;
  description: string;
  blobId: string;
}) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  const yearDateString = `${new Date().getFullYear().toString()}-${new Date().getMonth() + 1}`;

  tx.moveCall({
    target: `${PACKAGE_ID}::smwug::create_listing`,
    arguments: [
      tx.object(`${LISTINGS_REGISTRY_ID}`),
      tx.pure.string(yearDateString),
      tx.pure.string(title),
      tx.pure.string(subtitle),
      tx.pure.string(description),
      tx.pure.string(blobId || 'null')
    ]
  });

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.suiClient.executeTransactionBlock({
      transactionBlock: bytes,
      signature: signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showInput: true,
        showRawInput: true
      }
    });

    const listing = formatListingsCreatedEvent(executedTx);
    appState.addListing(listing);

    console.log('executedTx: ', executedTx);
    return executedTx;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Destroy listing
 */
export const destroyListing = async (listingId: string, yearMonth: string) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::smwug::destroy_listing`,
    arguments: [
      tx.object(`${LISTINGS_REGISTRY_ID}`),
      tx.object(listingId),
      tx.pure.string(yearMonth)
    ]
  });

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.suiClient.executeTransactionBlock({
      transactionBlock: bytes,
      signature: signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showInput: true,
        showRawInput: true
      }
    });

    console.log('executedTx: ', executedTx);
    return executedTx;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get listings & map to frontend format
 */
export const getListings = async () => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const listings = await walletAdapter.suiClient.getObject({
    id: `${LISTINGS_REGISTRY_ID}`,
    options: {
      showContent: true
    }
  });

  // console.log('listings: ', listings);

  const mappedListings = formatContractListings(listings);

  return mappedListings;
};

export const upvoteListing = async (listingId: string, yearMonth: string) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::smwug::upvote_listing`,
    arguments: [
      tx.object(`${LISTINGS_REGISTRY_ID}`),
      tx.pure.id(listingId),
      tx.pure.string(yearMonth)
    ]
  });
  console.log('1: ', listingId, yearMonth);

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});
    console.log('2');

    const executedTx = await walletAdapter.suiClient.executeTransactionBlock({
      transactionBlock: bytes,
      signature: signature,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showInput: true,
        showRawInput: true
      }
    });

    console.log('executedTx: ', executedTx);
    return executedTx;
  } catch (e) {
    console.log(e);
  }
};
