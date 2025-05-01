### Scroll System Notes
- `useScrollAnimation` (Home-specific scroll effects) — will be eventually merged into `useScrollParallax`.
- `useScrollParallax` (Generic parallax, scale, opacity effects) — used for showcases, hero, sections.
---
---

### Responsive Layout Guidelines

#### ✅ Tailwind Breakpoints
- `sm:` → ≥640px
- `md:` → ≥768px
- `lg:` → ≥1024px
- `xl:` → ≥1280px
- `2xl:` → ≥1536px

#### ✅ Layout Conventions
Use these consistently:
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for responsive columns
- `flex flex-col md:flex-row` for stacking → row transitions
- `max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8` for container padding
- `text-xl md:text-2xl lg:text-4xl` for scalable typography

#### 🧱 Component Tips
- Avoid hardcoded `w-[600px]` — use `max-w-*` with `px-*` padding
- Create responsive wrappers if reused often
- Prioritize `sm:` and `md:` shifts early in design phase

#### 📋 Audit Priority
- Home (hero + cards)
- Listings grid
- Listing detail (image + info side-by-side)
- Calculator layout
- Admin dashboard