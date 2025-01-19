export const formatContractListings = (getObjectResponse: any) => {
  const contents =
    getObjectResponse.data?.content?.fields?.listings?.fields?.contents || [];
  const listings = contents?.flatMap?.((content: any) => {
    const field = content?.fields?.value;
    const listings = field?.map?.((listing: any) => {
      return {
        id: listing?.fields?.id?.id,
        title: listing?.fields?.title,
        subtitle: listing?.fields?.subtitle,
        description: listing?.fields?.description,
        imageBlobId: listing?.fields?.image_blob_id,
        yearMonth: content?.fields?.key,
        owner: listing?.fields?.owner,
        comments: listing?.fields?.comments,
        upvotes: listing?.fields?.upvotes
      };
    });
    return listings;
  });

  return listings;
};

export const formatListingsCreatedEvent = (createListingExecutedTx: any) => {
  const events = createListingExecutedTx?.events;
  const listingCreatedEvent = events[0];
  const parsedJson = listingCreatedEvent?.parsedJson;

  const listing = {
    id: parsedJson?.listing_id,
    title: parsedJson?.title,
    subtitle: parsedJson?.subtitle,
    description: parsedJson?.description,
    imageBlobId: parsedJson?.image_blob_id,
    yearMonth: parsedJson?.year_month,
    owner: parsedJson?.owner,
    comments: [],
    upvotes: []
  };

  return listing;
};
