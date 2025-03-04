import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  // Badge,
  DataTable,
  ButtonGroup,
  Icon,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useEffect, useState } from "react";
import { useSubmit, useNavigate, json, useLoaderData } from "@remix-run/react";
import {
  deleteClosedHour,
  getClosedHourList,
  parseClosedHour,
} from "app/models/closedHour.server";
import { getShopTimezone } from "app/queries/timezone";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";

/*
import {
  createCloseHourDefinition,
  getCloseHour,
  getCloseHourDefinitionId,
} from "app/queries/closeHour.metafield";
  Definitions way:
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const timezone = await getShopTimezone(admin.graphql);

  const closeHourDefinitionId = await getCloseHourDefinitionId(admin.graphql);

  if (!closeHourDefinitionId) {
    await createCloseHourDefinition(admin.graphql);
  }
  const response = await getCloseHour(admin.graphql);

  return json(response.nodes);
};

*/

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const timezone = await getShopTimezone(admin.graphql);
  const closedHours = await getClosedHourList();

  return json(parseClosedHour(closedHours, timezone));
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await authenticate.admin(request);

  const formData = await request.formData();

  if (request.method.toLowerCase() === "delete") {
    await deleteClosedHour(Number(formData.get("id")));
  }

  return null;
};

export default function Index() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const [deleteItem, setDeleteItem] = useState(0);
  const [tableData, setTableData] = useState<
    (number | string | React.ReactNode)[][]
  >([]);

  useEffect(() => {
    const newData = loaderData.map((i) => {
      return [
        i.id,
        i.initialHour,
        i.finalHour,
        <ButtonGroup key={i.id}>
          <Button
            onClick={() => navigate(`/app/closedHour/${i.id}`)}
            tone="success"
            icon={<Icon source={EditIcon} tone="info" />}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteModal(i.id)}
            tone="critical"
            icon={<Icon source={DeleteIcon} tone="critical" />}
          >
            Delete
          </Button>
        </ButtonGroup>,
      ];
    });

    setTableData(newData);
  }, [loaderData, navigate]);

  function handleDeleteModal(id: number) {
    setDeleteItem(id);
    //@ts-ignore
    document.querySelector("#deleteModal")?.show();
  }

  function closeDeleteModal() {
    //@ts-ignore
    document.querySelector("#deleteModal")?.hide();
    setDeleteItem(0);
  }

  function handleDelete() {
    submit({ id: deleteItem }, { method: "delete" });
    closeDeleteModal();
  }

  return (
    <Page>
      <ui-modal id="deleteModal">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            margin: "10px",
          }}
        >
          <p style={{ textAlign: "center" }}>
            Are you sure you want to delete?
          </p>
        </div>
        <ui-title-bar title="Delete confirmation">
          <button variant="primary" onClick={handleDelete}>
            Delete
          </button>
          <button onClick={closeDeleteModal}>Cancel</button>
        </ui-title-bar>
      </ui-modal>
      <TitleBar title="Closed Hours"></TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Set your shop closed hours
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Use this app to set your shop closed hours. With this app,
                    you can create and update closed hours for your shop. If the
                    shop is closed, customers will not be able to add items to
                    cart and won't be able to checkout.
                  </Text>
                </BlockStack>

                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="h3" variant="headingMd">
                      Here is a list of your closed hours
                    </Text>
                    <Button onClick={() => navigate("/app/closedHour/new")}>
                      Add a closing hour
                    </Button>
                  </InlineStack>

                  <DataTable
                    columnContentTypes={["text", "text", "text", "text"]}
                    rows={tableData}
                    headings={["Id", "Initial hour", "Final hour", "Actions"]}
                  />
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
