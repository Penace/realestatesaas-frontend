import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";

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

        {/* Future: Other Routes like login could be outside Layout */}
        {/* Example: <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
