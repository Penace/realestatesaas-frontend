import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../Layout";
import Home from "../../pages/Home";
import Listings from "../../pages/Listings";
import ListingDetail from "../../pages/ListingDetail";
import Publish from "../../pages/Publish";
import AdminModeration from "../../pages/admin/AdminModeration";
import ManageListings from "../../pages/admin/ManageListings";
import withPageLoader from "../withPageLoader";

export default function App() {
  const Home = withPageLoader(lazy(() => import("../../pages/Home")));
  return (
    <Router>
      <Routes>
        {/* Wrapped Pages */}
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

        {/* Future: Other Routes like login could be outside Layout */}
        {/* Example: <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
