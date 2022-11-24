import { getPost, updatePost } from "~/models/post.server";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Post } from "~/models/post.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useLayoutEffect, useState } from "react";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

interface LoaderData {
  post: Post;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);

  invariant(post, `Post not found: ${params.slug}`);

  return json<LoaderData>({ post });
};

type ActionData =
  | {
      title: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request, params }) => {
  console.log("update action");
  const formData = await request.formData();

  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await updatePost({ title, markdown, slug: params.slug! });

  return redirect(`/posts/admin/${params.slug}`);
};

// https://remix.run/docs/en/v1/guides/data-loading#external-apis

export default function PostSlug() {
  const { post } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isUpdating = Boolean(transition.submission);
  const errors = useActionData();

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      {transition.state === "loading" ? (
        <>Loading...</>
      ) : (
        <>
          <Form method="post">
            <p>
              <label>
                Post Title:{" "}
                {errors?.title ? (
                  <em className="text-red-600">{errors.title}</em>
                ) : null}
                <input
                  defaultValue={post.title}
                  type="text"
                  name="title"
                  className={inputClassName}
                />
              </label>
            </p>
            <p>
              <label htmlFor="markdown">
                Markdown:
                {errors?.markdown ? (
                  <em className="text-red-600">{errors.markdown}</em>
                ) : null}
              </label>

              <br />
              <textarea
                id="markdown"
                rows={20}
                defaultValue={post.markdown}
                name="markdown"
                className={`${inputClassName} font-mono`}
              />
            </p>
            <p className="text-right">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                {isUpdating ? "Updating..." : "Update Post"}
              </button>
            </p>
          </Form>
          <Form method="post" action="/posts/delete">
            <input type="hidden" value={post.slug} name="post-slug" />
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
            >
              {isUpdating ? "Deleting..." : "Delete Post"}
            </button>
          </Form>
        </>
      )}
    </main>
  );
}
