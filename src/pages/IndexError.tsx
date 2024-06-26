import { useRouteError } from "react-router-dom";

export default function IndexError() {
  const error = useRouteError()
  console.error(error)
  // todo make it production ready

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* @ts-ignore */}
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}