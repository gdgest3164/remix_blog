import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import Todo from "~/components/todo";

interface ILoaderData {
  now: Date;
}

interface IActionData {
  message: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  console.log("loader 실행됨");
  return json<ILoaderData>({ now: new Date() });
};
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const test = body.get("test") as string;
  await new Promise((resolve) => setTimeout(resolve, 8000));
  return json<IActionData>({ message: test });
};

export default function Fetcher() {
  const fetcher = useFetcher();
  return (
    <div style={{ border: "3px solid red" }}>
      <h1>Hi I'm Fetcher</h1>
      <div>
        <button onClick={() => fetcher.load("/fetcher")}>Loader 값 불러오기</button>
        <button onClick={() => fetcher.submit({ test: "요청 성공" }, { method: "post", action: "/fetcher" })}>Form 사용하지 않고 Action 요청 보내기</button>
        {JSON.stringify(fetcher)}
      </div>
      <Todo />
      <Todo />
      <Todo />
    </div>
  );
}
