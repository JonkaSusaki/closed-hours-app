/**
 * Retrieves the ID of the 'closed-hour' metaobject definition.
 *
 * @param {any} graphql - The GraphQL client to execute the query.
 * @returns {Promise<{ id: string } | null>} - A promise that resolves to an object containing
 * the ID of the 'closed-hour' metaobject definition, or null if not found.
 */

import { ClosedHourCommand } from "app/types/closedHour";

export async function getCloseHourDefinitionId(graphql: any) {
  const metaobjectDefinition = await graphql(
    `
      #graphql
      query metaobjectDefinitionByType($type: String!) {
        metaobjectDefinitionByType(type: $type) {
          id
        }
      }
    `,
    {
      variables: {
        type: "closed-houaasdasdr",
      },
    },
  );

  const jsonResponse = await metaobjectDefinition.json();

  return jsonResponse.data.metaobjectDefinitionByType;
}

/**
 * Creates the 'closed-hour' metaobject definition if it does not already exist.
 *
 * @param {any} graphql - The GraphQL client to execute the mutation.
 * @returns {Promise<void>} - A promise that resolves when the mutation is complete.
 */
export async function createCloseHourDefinition(graphql: any) {
  const response = await graphql(
    `
      #graphql
      mutation CreateMetaObjectDefinition(
        $definition: MetaObjectDefinitionInput!
      ) {
        metaobjectDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            name
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `,
    {
      variables: {
        definition: {
          name: "Closed Hour",
          key: "closed-hour",
          type: "json",
          ownerType: "SHOP"
        },
      },
    },
  );

  const json = await response.json();

  return json.data.metafieldDefinitionCreate;
}

/**
 * Retrieves a list of 'closed-hour' metaobjects.
 *
 * @param {any} graphql - The GraphQL client to execute the query.
 * @returns {Promise<{ nodes: { fields: { key: string; value: string }[] }[] }>}
 * A promise that resolves to the metaobjects containing an array of nodes,
 * each with fields specifying the key-value pairs.
 */

export async function getCloseHour(graphql: any) {
  const metaobjects = await graphql(
    `
      #graphql
      query metaobjects($type: String!, $first: Int!) {
        metaobjects(type: $type, first: $first) {
          nodes {
            fields {
              key
              value
            }
          }
        }
      }
    `,
    {
      variables: {
        type: "closed-hour",
        first: 100,
      },
    },
  );

  const response = await metaobjects.json();

  return response.data.metaobjects;
}

/**
 * Creates a new 'closed-hour' metaobject.
 *
 * @param {any} graphql - The GraphQL client to execute the mutation.
 * @param {ClosedHourCommand} data - The data containing initial and final hours to create the metaobject with.
 *
 * @returns {Promise<void>} - A promise that resolves when the metaobject creation is complete.
 * If there are user errors, they will be included in the response.
 */

export async function createCloseHour(graphql: any, data: ClosedHourCommand) {
  const response = await graphql(
    `
      #graphql
      mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            fields {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metaobject: {
          type: "closed-hour",
          fields: [
            {
              key: "initialHour",
              value: data.initialHour,
            },
            {
              key: "finalHour",
              value: data.finalHour,
            },
          ],
        },
      },
    },
  );

  return await response.json();
}
