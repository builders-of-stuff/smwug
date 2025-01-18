module smwug::smwug;

use std::string::String;
use sui::vec_map::{Self, VecMap};

public struct ListingsRegistry has key {
    id: UID,
    // Keyed by year-month
    listings: VecMap<String, vector<Listing>>,
}

public struct Listing has key, store {
    id: UID,
    owner: address,
    year_month: String,
    title: String,
    subtitle: String,
    description: String,
    // Blob id
    image_blob_id: String,
    comments: vector<Comment>,
    upvotes: vector<address>,
}

public struct Comment has key, store {
    id: UID,
    author: address,
    content: String,
    created_at: u64,
    listing_id: ID,
}

fun init(ctx: &mut TxContext) {
    let listings_registry = ListingsRegistry {
        id: object::new(ctx),
        listings: vec_map::empty(),
    };

    transfer::share_object(listings_registry);
}

public fun create_listing(
    registry: &mut ListingsRegistry,
    year_month: String,
    title: String,
    subtitle: String,
    description: String,
    image_blob_id: String,
    ctx: &mut TxContext,
) {
    let listing = Listing {
        id: object::new(ctx),
        owner: tx_context::sender(ctx),
        year_month,
        title,
        subtitle,
        description,
        image_blob_id,
        comments: vector::empty(),
        upvotes: vector::empty(),
    };

    if (vec_map::contains(&registry.listings, &year_month)) {
        let listings_vec = vec_map::get_mut(&mut registry.listings, &year_month);
        vector::push_back(listings_vec, listing);
    } else {
        vec_map::insert(&mut registry.listings, year_month, vector::singleton(listing));
    };
}

public fun destroy_listing(
    registry: &mut ListingsRegistry,
    listing_id: ID,
    year_month: String,
    ctx: &mut TxContext,
) {
    assert!(vec_map::contains(&registry.listings, &year_month), 0);
    let listings_vec = vec_map::get_mut(&mut registry.listings, &year_month);

    let mut i = 0;
    let len = vector::length(listings_vec);
    while (i < len) {
        let listing = vector::borrow(listings_vec, i);
        if (object::uid_to_inner(&listing.id) == (&listing_id)) {
            assert!(listing.owner == tx_context::sender(ctx), 1);

            let listing = vector::remove(listings_vec, i);
            let Listing {
                id,
                owner: _,
                year_month: _,
                title: _,
                subtitle: _,
                description: _,
                image_blob_id: _,
                comments: mut comments,
                upvotes: _,
            } = listing;

            let mut j = 0;
            let comments_len = vector::length(&comments);
            while (j < comments_len) {
                let comment = vector::remove(&mut comments, j);

                let Comment {
                    id: comment_id,
                    author: _,
                    content: _,
                    created_at: _,
                    listing_id: _,
                } = comment;

                object::delete(comment_id);
                j = j + 1;
            };

            vector::destroy_empty(comments);
            object::delete(id);

            break
        };
        i = i + 1;
    };
}
