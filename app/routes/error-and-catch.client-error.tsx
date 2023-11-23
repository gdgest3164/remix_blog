import { useRouteError } from "@remix-run/react";

export default function ClientError() {
  throw new Error("에러 발생시키기");
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
