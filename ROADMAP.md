# RealEstateSaaS Frontend – Roadmap

---

## Phase 1: Base Setup

- [x] Create repository
- [x] Setup Vite + Tailwind project
- [x] Create minimal landing page

---

## Phase 2: GitOps Deployment

- [x] Git clone into Web Server VM
- [x] Build static files
- [ ] Serve using Nginx or systemd

---

## Phase 3: UI and Content

- [x] Build homepage
- [x] Create property listing page
- [x] Create property detail page

---

## Phase 4: API Integration

- [x] Connect to API Server (json-server or backend)
- [x] Display dynamic property data

---

## Phase 5: Admin Features

- [x] Admin layout and routing
- [x] User moderation panel
- [x] Listing moderation panel
- [x] Admin settings
- [x] Analytics dashboard

---

## Phase 6: User Dashboards & Roles

- [x] User dashboard layout
- [x] Agent dashboard layout
- [x] Role-based navigation (admin, agent, user)
- [x] Agent dashboard listing preview
- [ ] Improve dashboard sidebar responsiveness
- [ ] Add persistent sidebar state per session

---

## Phase 7: UI Polish & UX Flow

- [x] Refactor ListingCard layout
- [x] Fix image path logic using `VITE_IMAGE_BASE_URL`
- [x] Align property info sections in ListingDetail
- [ ] Finalize consistent spacing, font sizes, and colors
- [ ] Improve empty state components

---

## Phase 8: Real-Time Features (Future)

- [ ] Add toast notifications for global events
- [ ] Implement real-time listing status updates (WebSocket-ready)
- [ ] Show dynamic maintenance mode notice

---

## Phase 9: Optimization & Deployment

- [ ] Lazy load heavy images
- [ ] Audit for bundle size and tree-shaking
- [ ] Deploy static frontend to CDN (optional)

---

> 🚀 *Frontend brings the vision to life — pixel by pixel.*
