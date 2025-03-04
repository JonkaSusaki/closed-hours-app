# Closed hours

Create a Shopify application that disables the "Add to Cart" button on a merchant's product detail page (PDP) during certain hours (e.g. while the store is “closed”). Instead, display a "Store is Closed" message when the button is disabled.
Requirements:

    The merchant should be able to configure the hours during which the "Store is Closed" message is displayed. This configuration should be managed through an embedded app in Shopify Admin.

    The implementation should be as seamless for the merchant to use as possible. Ensure the app works on as many merchant's storefronts out of the box as possible.

    Prevent shoppers from checking out during the "closed" time window, even if they’ve added a product to their cart during the “open” time window. 


---

## Ideas

First, there is the creation of the app itself, and the UI. It is a simple form containing the **Initial Hour** and **Final Hour** of the Shop closing time. Always working with UTC values for global compatibility. This "Closing time" could be either stored in a SQLite db (already comes with the app template) or inside Metafields.

I first tried doing with SQLite (app/models/closedHour.server.ts) and it worked perfectly inside the Admin app. The problem was using those values inside the storefront.

Searching on how to do it, shopify gives us a "simple" and a "hard" way. 

I define them as "simple" and "hard" because of merchants shop configuration.

#### The "Hard" way - SQLite and Theme App Extension
To change the storefront UI there must be a Theme App Extension.

Using it, allowed me to fetch my "Closing time" and manipulate the UI as I wanted (hiding the "Add to Cart" and "Buy now" buttons and adding a "Store is Closed" button).

To fetch my data, I pointed it to my preview URL that shopify gives us.

The problem with this approach is that the implementation is not "seamless", because merchants should add the App inside the PDP page and the Cart page.

So I tried the other way.

#### The "Simple" way - Metafields and Shopify Funcitons

This approach doesn't require configuration making it "seamless".

So I started doing the graphql queries (app/queries/closeHour.metafield.ts) and was also handling the data correctly using **METAOBJECTS** and its definitions. 

While I was doing the queries, I was also doing some research on Cart_Checkout_Validation and found out that I wasn't able to fetch those metaobjects (just metafields) inside my function.

But the main issue was that I couldn't get my customer timezone inside my Shopify function. If I am not able to get my customer timezone, it would only work for local customers.


--- 

So after a lot of research and thinking about it, I chose to go with the "Hard" way because it would actually work, meaning that no none, globally, would be able to check out.

