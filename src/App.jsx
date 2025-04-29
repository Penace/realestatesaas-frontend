import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Publish from "./pages/Publish";
import AdminModeration from "./pages/AdminModeration";
import ManageListings from "./pages/ManageListings";

export default function App() {
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
          path="/manage"
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
