# Portfolio Site — Aman Kant Jha

A backend-developer portfolio built with **Django** + **Three.js**, themed around a working terminal interface.

## What's here (Phase 1 + 2 + skills graph)

- **Django backend** — content (experience, projects, skills) lives in the database and is editable via Django admin, not hardcoded in templates.
- **Interactive 3D terminal** — the hero section contains a real, typeable terminal. Commands like `whoami`, `experience`, `projects`, `skills`, `contact`, `help`, `clear` navigate the page. Try `sudo hire-me` too.
- **3D node-graph background** — a Three.js wireframe network in the hero, subtly responsive to mouse movement, evoking distributed systems without being literal.
- **3D tilt effect on project cards** — hover a project card and it tilts in 3D based on cursor position.
- **3D skills node graph** — each skill is a node clustered by category (Language / Backend / Database / etc.) around category hubs, color-coded, draggable to rotate, with hover labels.
- **Real resume content**, seeded via a management command — not placeholder text.

Still to come (per our plan): a request/response flow animation for an "architecture" section.

## Stack

- Django 6 (templates, models, admin)
- Three.js (vendored locally as an ES module — no CDN dependency at runtime)
- Vanilla JS (no frontend framework, to keep things approachable while learning)
- SQLite (swap for Postgres in production if you like)

## Running it locally

```bash
# 1. Create and activate a virtualenv
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Seed your resume content
python manage.py seed_resume

# 5. (optional) create an admin user to edit content via /admin
python manage.py createsuperuser

# 6. Run the dev server
python manage.py runserver
```

Visit `http://localhost:8000/`.

## Editing content

All resume content (experience, projects, skills) is stored in the database, not hardcoded in templates. Two ways to edit it:

1. **Django admin** — go to `/admin`, log in with your superuser, and edit Experience/Project/Skill entries directly.
2. **Re-run the seed script** — edit `core/management/commands/seed_resume.py` and re-run `python manage.py seed_resume` (note: this wipes and re-seeds Experience/Project/Skill tables).

## Project structure

```
portfolio/
├── core/
│   ├── models.py              # Experience, Project, Skill + highlight models
│   ├── views.py                # single home view, passes content to template
│   ├── admin.py                 # admin config with inline highlights
│   ├── management/commands/
│   │   └── seed_resume.py       # seeds real resume content
│   └── templates/core/
│       ├── base.html             # fonts, importmap for three.js
│       └── home.html             # hero terminal, experience, projects, skills, contact
├── static/
│   ├── css/main.css              # design tokens + all styling
│   └── js/
│       ├── hero-scene.js          # Three.js node-graph background
│       ├── terminal.js            # terminal command parser/UI
│       ├── card-tilt.js           # 3D hover tilt for project cards
│       └── vendor/three.module.min.js
└── portfolio_site/                # Django project settings/urls
```

## Design notes

- Color/type system: dark terminal palette (`#0a0e0f` background, `#00ff9c` phosphor-green accent), JetBrains Mono for terminal/labels, Inter for body copy.
- The terminal is functional, not decorative — it's your actual site navigation.
- `prefers-reduced-motion` is respected: the 3D background, card tilt, and skills graph all disable/reduce animation if the user has that OS setting on.

## Deployment

This is dev-only right now (`DEBUG = True`, SQLite, no `ALLOWED_HOSTS`). Before deploying:
- Set `DEBUG = False` and configure `ALLOWED_HOSTS`
- Move `SECRET_KEY` to an environment variable
- Run `python manage.py collectstatic` and serve static files via whitenoise or a CDN
- Consider Postgres if you want the admin to be production-grade
