import { testnetWalletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
import { Transaction } from '@mysten/sui/transactions';
import { LISTINGS_REGISTRY_ID, PACKAGE_ID } from './shared.constant';
import { formatContractListings } from './contract.mappers';

const walletAdapter = testnetWalletAdapter;

export const createListing = async () => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::smwug::create_listing`,
    arguments: [
      tx.object(`${LISTINGS_REGISTRY_ID}`),
      tx.pure.string('2025-02'),
      tx.pure.string('My Listing'),
      tx.pure.string('My Subtitle'),
      tx.pure.string('My Description'),
      tx.pure.string(`placeholder blob id`)
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

export const destroyListing = async (listingId: string) => {
  if (!walletAdapter?.currentAccount?.address) {
    return;
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::smwug::destroy_listing`,
    arguments: [
      tx.object(`${LISTINGS_REGISTRY_ID}`),
      tx.object(listingId),
      tx.pure.string('2025-01')
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

  console.log('listings: ', JSON.stringify(listings, null, 2));

  const mapped = formatContractListings(listings);

  console.log('mapped: ', JSON.stringify(mapped, null, 2));
  return listings;
};
