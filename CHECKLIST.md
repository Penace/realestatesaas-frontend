# RealEstateSaaS Frontend – Deployment Checklist

---

## Pre-Deployment

- [x] Git repository initialized
- [x] Vite project built
- [x] TailwindCSS configured

---

## Deployment on VM

- [x] SSH into Web Server
- [x] Clone repository
- [x] Install Node.js (if not installed)
- [x] Install dependencies (`pnpm install`)
- [ ] Build production files (`pnpm run build`)
- [ ] Serve via Nginx or Preview Server (`pnpm run preview`)

---

## Final Checks

- [x] Accessible via VM static IP
- [ ] Nginx or PM2 service configured and running (TODO)
- [x] Logs monitored

✅ Frontend operational on Web Server VM.

---

## Post-Deployment Tasks

- [ ] Set `VITE_IMAGE_BASE_URL` correctly in `.env.production`
- [ ] Confirm image paths load correctly from server
- [ ] Verify logout/login conditional rendering works in Navbar
- [ ] Confirm DashboardSidebar works and collapses properly
- [ ] Test Maintenance Mode toggle from Admin Settings
- [ ] Check user-based route access (admin, agent, user)
- [ ] Verify dynamic fetch logic (favorites, listing detail, drafts)
