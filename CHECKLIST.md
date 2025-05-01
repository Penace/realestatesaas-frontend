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
- [ ] Nginx or PM2 service running
- [ ] Logs monitored

✅ Frontend operational on Web Server VM.

---
