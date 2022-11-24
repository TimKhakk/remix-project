import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deletePost } from "~/models/post.server";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const slug = formData.get("post-slug") as string;
  invariant(slug, `formData.slug is required`);

  await deletePost(slug);

  return redirect(`/posts/admin/`);
};