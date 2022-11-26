import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { updateLinearApiKey } from "~/models/user.server";
import { getUserId, logout } from "~/session.server";
import { toast } from "react-toastify";
import { useEffect } from "react";

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

  return json({
    message: 'The linear api key is updated!',
  }, {
    status: 200,
  });
}

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()

  // TODO custom hook
  useEffect(() => {
    if (searchParams.has('wrongLinearApiKey')) {
      toast("Your linear api key is invalid! Please Update it", {
        type: 'error',
      })
      setSearchParams(new URLSearchParams())
    }
  }, [searchParams, setSearchParams])


  // TODO custom hook
  useEffect(() => {
    if (actionData?.message) {
      toast(actionData.message, {
        type: 'success',
      })
    }
  }, [actionData])


  return (
    <div className="mx-auto max-w-4xl">
      <Form method="post" className="flex flex-col gap-2 p-2">
        <label className="block text-sm font-medium">
          Linear Api Key
          <input
            required
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            type="text"
            name={LINEAR_API_KEY}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Update
        </button>
      </Form>
    </div>
  );
}
