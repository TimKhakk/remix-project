import { ActionFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deletePost } from "~/models/post.server";

export const action: ActionFunction = async ({ request, params }) => {
  console.log('delete action');
  const formData = await request.formData();

  const slug = formData.get("post-slug");
  console.log('🚀 ~ slug', slug);
  invariant(slug, `formData.slug is required`);

  await deletePost(slug!);

  return redirect(`/posts/admin/`);
};