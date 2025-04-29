import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../Layout";
import withPageLoader from "../withPageLoader";

// Lazy load all pages with fallback spinner
const Home = withPageLoader(lazy(() => import("../../pages/Home")));
const Listings = withPageLoader(lazy(() => import("../../pages/Listings")));
const ListingDetail = withPageLoader(
  lazy(() => import("../../pages/ListingDetail"))
);
const Publish = withPageLoader(lazy(() => import("../../pages/Publish")));
const AdminModeration = withPageLoader(
  lazy(() => import("../../pages/admin/AdminModeration"))
);
const ManageListings = withPageLoader(
  lazy(() => import("../../pages/admin/ManageListings"))
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/listings"
            element={
              <Layout>
                <Listings />
              </Layout>
            }
          />
          <Route
            path="/listings/:id"
            element={
              <Layout>
                <ListingDetail />
              </Layout>
            }
          />
          <Route
            path="/publish"
            element={
              <Layout>
                <Publish />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminModeration />
              </Layout>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <Layout>
                <ManageListings />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
