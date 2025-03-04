import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useSubmit,
  useNavigate,
  json,
  useNavigation,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  InlineError,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import TimeInput from "app/components/input/TimeInput";
import {
  createClosedHour,
  getClosedHourById,
  updateClosedHour,
  validateClosedHour,
} from "app/models/closedHour.server";
import { getShopTimezone } from "app/queries/timezone";
import { authenticate } from "app/shopify.server";
import type {
  ClosedHourCommand,
  ClosedHourValidationError,
} from "app/types/closedHour";
import { convertTimeToUTC } from "app/utils/timeConversion";
import isValidTimeFormat from "app/validations/timeValidation";
import { useState } from "react";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  if (params.id === "new") {
    return json({ id: 0, initialHour: "00:00", finalHour: "08:00" });
  }

  const timezone = await getShopTimezone(admin.graphql);

  const closedHour = await getClosedHourById(Number(params.id), timezone);

  return json(closedHour);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);

  const formData = await request.formData();
  const initialHour = formData.get("initialHour") as string;
  const finalHour = formData.get("finalHour") as string;

  const timezone = await getShopTimezone(admin.graphql);

  const body: ClosedHourCommand = {
    initialHour: convertTimeToUTC(initialHour, timezone),
    finalHour: convertTimeToUTC(finalHour, timezone),
    userId: session.onlineAccessInfo?.associated_user?.id || 0,
  };

  const errors = validateClosedHour(body);

  if (Object.keys(errors).length > 0) {
    return json(errors, { status: 422 });
  }

  if (params.id === "new") {
    await createClosedHour(body);
  } else {
    await updateClosedHour(body, Number(params.id));
  }

  return redirect("/app");
}

export default function ClosedHour() {
  const loaderData = useLoaderData<typeof loader>();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const submit = useSubmit();
  const nav = useNavigation();
  const isSaving = nav.state === "submitting";
  const [formData, setFormData] = useState<
    Pick<ClosedHourCommand, "initialHour" | "finalHour">
  >({
    initialHour: loaderData.initialHour || "00:00",
    finalHour: loaderData.finalHour || "08:00",
  });
  const [errors, setErrors] = useState<ClosedHourValidationError>({});

  function handleBlur(fieldName: "initialHour" | "finalHour") {
    if (!formData[fieldName] || !isValidTimeFormat(formData[fieldName])) {
      setErrors({
        ...errors,
        [fieldName]: "Invalid time format",
      });

      return false;
    }

    setErrors({
      ...errors,
      [fieldName]: "",
    });

    return true;
  }

  function closeForm() {
    setFormData({
      initialHour: "00:00",
      finalHour: "08:00",
    });
    setErrors({});
    navigate("/app");
  }

  function handleSubmit() {
    const body: ClosedHourCommand = {
      initialHour: formData.initialHour,
      finalHour: formData.finalHour,
    };

    if (!handleBlur("initialHour") || !handleBlur("finalHour")) {
      return;
    }

    shopify.toast.show("Closed hour saved successfully");
    submit(body, { method: "post" });
  }

  return (
    <Page>
      <TitleBar title="Closed Hours"></TitleBar>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h3">Define your closed hours</Text>
              <Text as="p">
                During these hours, your business will be marked as closed.
                Customers will be able to see your products, but they won't be
                able to buy them.
              </Text>

              <FormLayout>
                <FormLayout.Group condensed>
                  <div>
                    <TimeInput
                      label="Initial hour"
                      setValue={(value) =>
                        setFormData({ ...formData, initialHour: value })
                      }
                      value={formData.initialHour}
                      onBlur={() => handleBlur("initialHour")}
                    />
                    <InlineError
                      message={errors.initialHour || ""}
                      fieldID="initialHour"
                    />
                  </div>

                  <div>
                    <TimeInput
                      label="Final hour"
                      setValue={(value) =>
                        setFormData({ ...formData, finalHour: value })
                      }
                      value={formData.finalHour}
                      onBlur={() => handleBlur("finalHour")}
                    />
                    <InlineError
                      message={errors.finalHour || ""}
                      fieldID="finalHour"
                    />
                  </div>
                </FormLayout.Group>
              </FormLayout>

              <InlineStack align="end">
                <ButtonGroup>
                  <Button variant="tertiary" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={isSaving}
                    disabled={
                      isSaving ||
                      Boolean(errors.initialHour) ||
                      Boolean(errors.finalHour)
                    }
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
