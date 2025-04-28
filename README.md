# RealEstateSaaS – Frontend

## Overview

This is the frontend for the RealEstateSaaS project.

Built with:
- Vite.js
- TailwindCSS
- Modular GitOps deployment standards
- PNPM package manager for faster builds

---
## Development Setup

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
VITE_API_URL=http://localhost:3000
```

✅ This allows the frontend to dynamically connect to your backend API without hardcoding localhost or VM IPs.

6. Run development server (optional):

```bash
pnpm dev
```

> Note: Add `--host` flag if hosting on VM to access from other devices on different sub-networks.

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