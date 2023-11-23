import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";

interface IError {
  message: string;
}

export const action: ActionFunction = async () => {
  throw json<IError>({ message: "액션 오류 발생" }, { status: 500 });
};

export default function ActionError() {
  return (
    <div style={{ border: "3px solid blue" }}>
      <h1>Action Error</h1>
      <Form method="post">
        <button type="submit">액션에 전송</button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.status}</p>
        <p>The stack trace is:</p>
        <pre>{error.data?.message}</pre>
      </div>
    );
  } else {
    return <></>;
  }
}
