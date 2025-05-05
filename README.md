# RealEstateSaaS – Frontend (Vite + Tailwind)

## Overview

This is the frontend for the RealEstateSaaS platform – a full-featured real estate listing system with dashboards, admin controls, and modular UI.

Built for performance, scalability, and developer experience using:
- Vite for blazing-fast dev & build
- TailwindCSS for utility-first styling
- Modular GitOps-friendly deployment

---
## Admin Features

- Moderate listings
- Approve users
- Configure site settings
- View analytics

---
## Local Development Setup

1. Install Node.js on your machine or VM:

```bash
sudo apt update
sudo apt install nodejs npm -y
```

2. Install pnpm globally:

```bash
sudo npm install -g pnpm
```

3. Clone the repository:

```bash
git clone git@github.com:Penace/realestatesaas-frontend.git
```

> ⚡ Note:
> Running `git clone` automatically creates a new folder named after the repository.
> No need to manually `mkdir` unless you want a different folder name.

4. Install project dependencies:

```bash
cd realestatesaas-frontend
pnpm install
```

5. Create `.env` file:

Create a `.env` file inside the frontend folder with the following contents:

```dotenv
VITE_API_URL=http://localhost:4000/api
VITE_IMAGE_BASE_URL=http://localhost:4000
```

✅ These variables allow the frontend to dynamically connect to your backend API and serve optimized image URLs without hardcoding values into the codebase.

> 💡 To connect to a production backend, update `VITE_API_URL` (and `VITE_IMAGE_BASE_URL` if needed) to point to your live API endpoint.

6. Run development server (optional):

```bash
pnpm run dev
```

> Note: Add `--host` flag if hosting on VM to access from other devices on different sub-networks.

7. Optional formatting and linting:

```bash
pnpm run format
pnpm run lint
```

---
## Production Build

1. Create a production build:

```bash
pnpm build
```

2. Preview build locally:

```bash
pnpm preview
```

✅ Serve the `dist/` directory using Nginx or any static server.

---
## Project Architecture

| Area | Stack |
|:---|:---|
| Build Tool | Vite |
| Styling | TailwindCSS |
| Deployment | GitOps (clone + build + systemd/PM2) |

---
## Roadmap

See [ROADMAP.md](./ROADMAP.md)

---
## Additional Resources

- [RealEstateSaaS Backend Repo](https://github.com/Penace/realestatesaas-backend)

---
## License

TBD – License details will be added here for open-source or closed-source usage.