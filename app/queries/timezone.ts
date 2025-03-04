// TODO: get graphql client type

/**
 * Get the timezone of the shop.
 * @param {GraphQLClient<AdminOperations>} graphql GraphQL client
 * @returns {Promise<string | null>} The timezone of the shop, or null if the
 * operation failed.
 */
export async function getShopTimezone(graphql: any) {
  const response = await graphql(`
    #graphql
    query {
      shop {
        ianaTimezone
      }
    }
  `);

  const jsonResponse = await response.json();

  return jsonResponse.data?.shop?.ianaTimezone;
}
