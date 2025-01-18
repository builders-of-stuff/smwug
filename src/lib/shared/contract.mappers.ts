export const formatContractListings = (getObjectResponse: any) => {
  const contents =
    getObjectResponse.data?.content?.fields?.listings?.fields?.contents || [];
  const listings = contents?.flatMap?.((content: any) => {
    const field = content?.fields?.value;
    const listings = field?.map?.((listing: any) => {
      return {
        id: listing?.fields?.id?.id,
        name: listing?.fields?.name,
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
