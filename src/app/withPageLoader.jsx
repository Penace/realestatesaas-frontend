import { Suspense } from "react";
import PageLoader from "./PageLoader";

export default function withPageLoader(Component) {
  return function WrappedComponent() {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    );
  };
}
