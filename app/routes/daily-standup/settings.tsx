import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { updateLinearApiKey } from "~/models/user.server";
import { getUserId, logout } from "~/session.server";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Button } from "~/components/shared/Button";
import { useUser } from "~/utils";
import { EMPTY_LINEAR_API_KEY_SEARCH_PARAM, WRONG_LINEAR_API_KEY_SEARCH_PARAM } from "./index";

const LINEAR_API_KEY = "linear-api-key";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const linearApiKey = formData.get(LINEAR_API_KEY);

  if (typeof linearApiKey !== "string" || linearApiKey.length === 0) {
    return json(
      { errors: { linearApiKey: "LinearApiKey is required" } },
      { status: 400 }
    );
  }

  const id = await getUserId(request);

  if (!id) {
    throw await logout(request);
  }

  await updateLinearApiKey({ id, linearApiKey });

  return json(
    {
      message: "The linear api key is updated!",
    },
    {
      status: 200,
    }
  );
}

export default function Settings() {
  const user = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();

  // TODO custom hook
  useEffect(() => {
    if (searchParams.has(WRONG_LINEAR_API_KEY_SEARCH_PARAM)) {
      toast("Your linear api key is invalid! Please update it", {
        type: "error",
      });
      setSearchParams(new URLSearchParams());
    }
    if (searchParams.has(EMPTY_LINEAR_API_KEY_SEARCH_PARAM)) {
      toast("Your linear api key is not set! Please set it", {
        type: "error",
      });
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  // TODO custom hook
  useEffect(() => {
    if (actionData?.message) {
      toast(actionData.message, {
        type: "success",
      });
    }
  }, [actionData]);

  return (
    <div className="mx-auto my-6 w-[935px] rounded border-app-primary-800 bg-app-primary-900">
      <Form method="post" className="flex flex-col gap-2">
        <div className="grid grid-cols-2 p-8">
          <div>
            <h2>Daily Standup Settings</h2>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Linear Api Key
            <input
              required
              defaultValue={user.linearApiKey}
              className="w-full rounded border border-gray-500 bg-app-primary-900 px-2 py-1"
              type="text"
              name={LINEAR_API_KEY}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-app-primary-800 py-4 px-8">
          <Button type="reset">Cancel</Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
