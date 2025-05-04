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
const ListingModeration = withPageLoader(() =>
  import("../../pages/admin/ListingModeration")
);
const ManageListings = withPageLoader(() =>
  import("../../pages/admin/ManageListings")
);
const UserModeration = withPageLoader(() =>
  import("../../pages/admin/UserModeration")
);
const AdminSettings = withPageLoader(() =>
  import("../../pages/admin/Settings")
);
const Analytics = withPageLoader(() => import("../../pages/admin/Analytics"));
const UserProfile = withPageLoader(() => import("../../pages/UserProfile"));
const PendingListingDetail = withPageLoader(() =>
  import("../../pages/PendingListingDetail")
);
const NotFound = withPageLoader(() => import("../../pages/NotFound"));
const AdminLayout = withPageLoader(() => import("../../layouts/AdminLayout"));
const SignUp = withPageLoader(() => import("../../pages/SignUp"));
const Login = withPageLoader(() => import("../../pages/Login"));
const UserDashboard = withPageLoader(() => import("../../pages/UserDashboard"));
const AgentDashboard = withPageLoader(() =>
  import("../../pages/AgentDashboard")
);
const Calculator = withPageLoader(() => import("../../pages/Calculator"));
const MaintenancePage = withPageLoader(() =>
  import("../../pages/MaintenancePage")
);

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
            path="/agent-dashboard"
            element={
              <Layout>
                <AgentDashboard />
              </Layout>
            }
          />
          <Route
            path="/calculator"
            element={
              <Layout>
                <Calculator />
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
            <Route index element={<ListingModeration />} />
            <Route path="manage" element={<ManageListings />} />
            <Route path="users" element={<UserModeration />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route
            path="/users/:id"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route
            path="/pending/:id"
            element={
              <Layout>
                <PendingListingDetail />
              </Layout>
            }
          />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
