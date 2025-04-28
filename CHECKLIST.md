# RealEstateSaaS Frontend – Deployment Checklist

---

## Pre-Deployment

- [x] Git repository initialized
- [x] Vite project built
- [x] TailwindCSS configured

---

## Deployment on VM

- [ ] SSH into Web Server
- [ ] Clone repository
- [ ] Install Node.js (if not installed)
- [ ] Install dependencies (`npm install`)
- [ ] Build production files (`npm run build`)
- [ ] Serve via Nginx or Preview Server (`npm run preview`)

---

## Final Checks

- [ ] Accessible via VM static IP
- [ ] Nginx or PM2 service running
- [ ] Logs monitored

✅ Frontend operational on Web Server VM.

---
