// src/app/routes/routes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../../layouts/Layout";
import withPageLoader from "../withPageLoader";

// Lazy-wrapped pages
const Home = withPageLoader(() => import("../../pages/Home"));
const Listings = withPageLoader(() => import("../../pages/Listings"));
const ListingDetail = withPageLoader(() => import("../../pages/ListingDetail"));
const Publish = withPageLoader(() => import("../../pages/Publish"));
const AdminModeration = withPageLoader(() =>
  import("../../pages/admin/AdminModeration")
);
const ManageListings = withPageLoader(() =>
  import("../../pages/admin/ManageListings")
);
const PendingListingDetail = withPageLoader(() =>
  import("../../pages/PendingListingDetail")
);
const NotFound = withPageLoader(() => import("../../pages/NotFound"));
const AdminLayout = withPageLoader(() => import("../../layouts/AdminLayout"));
const SignUp = withPageLoader(() => import("../../pages/SignUp"));
const Login = withPageLoader(() => import("../../pages/Login"));
const UserDashboard = withPageLoader(() => import("../../pages/UserDashboard"));

export default function AppRoutes() {
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
            path="/signup"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <UserDashboard />
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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminModeration />} />
            <Route path="manage" element={<ManageListings />} />
          </Route>
          <Route
            path="/pending/:id"
            element={
              <Layout>
                <PendingListingDetail />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
