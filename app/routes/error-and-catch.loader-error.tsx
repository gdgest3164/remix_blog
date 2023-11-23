import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

interface IError {
  message: string;
}

export const loader: LoaderFunction = async () => {
  throw json<IError>({ message: "로더 오류 발생" }, { status: 500 });
};

export default function LoaderError() {
  <div style={{ border: "3px solid blue" }}>
    <h1>Loader Error</h1>
  </div>;
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
