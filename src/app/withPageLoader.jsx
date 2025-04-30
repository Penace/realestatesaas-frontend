import { lazy, Suspense } from "react";
import PageLoader from "./PageLoader";

export default function withPageLoader(importFn) {
  const LazyComponent = lazy(importFn);

  return function WrappedComponent(props) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
