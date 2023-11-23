import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
// import { useTransition } from "react";

interface IActionData {
  message: string;
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const test = body.get("test") as string;
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return json<IActionData>({ message: test });
};

export default function Transition() {
  const transition = useNavigation();
  const data = useActionData<IActionData>();

  return (
    <div style={{ border: "3px solid red" }}>
      <h1>Hi I'm Transition</h1>
      {JSON.stringify(data)}
      <Form method="post">
        <div>{JSON.stringify(transition)}</div>
        <input type="text" name="test" />
        <button type="submit">전송</button>
      </Form>
      <Form method="post">
        <div>{JSON.stringify(transition)}</div>
        <input type="text" name="test" />
        <button type="submit">전송</button>
      </Form>
    </div>
  );
}
