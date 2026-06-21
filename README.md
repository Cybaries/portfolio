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
- **MongoDB** via the official [`django-mongodb-backend`](https://www.mongodb.com/docs/languages/python/django-mongodb/current/) when `MONGO_URI` is set — falls back to SQLite for local dev if it isn't
- Three.js (vendored locally as an ES module — no CDN dependency at runtime)
- Vanilla JS (no frontend framework, to keep things approachable while learning)
- Deployed on Vercel (see `vercel.json` / `build_files.sh`)

## Database: MongoDB

This project uses MongoDB in production via the official `django-mongodb-backend`. It's driven entirely by environment variables — no connection string is committed to the repo.

**Environment variables:**

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | for MongoDB | Full connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority` |
| `MONGO_DB_NAME` | optional | Database name (defaults to `portfolio`) |

If `MONGO_URI` is **not** set, the project automatically falls back to a local SQLite database — handy for quick local testing without needing a Mongo instance.

**To run against MongoDB locally:**

```bash
export MONGO_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
python manage.py migrate
python manage.py seed_resume
python manage.py runserver
```

On Vercel (or any other host), set `MONGO_URI` as a project environment variable rather than exporting it locally — `build_files.sh` runs `migrate` and `seed_resume` automatically during deploy.

**How the switch works under the hood:** MongoDB documents use `ObjectId` as their primary key instead of an auto-incrementing integer, so when `MONGO_URI` is set, `settings.py` swaps in MongoDB-flavored `AppConfig`s for `admin`/`auth`/`contenttypes` (see `portfolio_site/apps.py`) and MongoDB-specific migrations for those same contrib apps (see `portfolio_site/mongo_migrations/`). Our own `core` app models work unchanged either way.

## Running it locally

```bash
# 1. Create and activate a virtualenv
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. (optional) point at MongoDB — see "Database: MongoDB" above.
#    Skip this and the project uses SQLite instead.
export MONGO_URI="mongodb+srv://..."

# 4. Run migrations
python manage.py migrate

# 5. Seed your resume content
python manage.py seed_resume

# 6. (optional) create an admin user to edit content via /admin
python manage.py createsuperuser

# 7. Run the dev server
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
│       ├── skills-graph.js        # Three.js skills node graph
│       └── vendor/three.module.min.js
├── portfolio_site/                # Django project settings/urls
│   ├── settings.py                 # MONGO_URI-driven DB switch (Mongo / SQLite)
│   ├── apps.py                     # MongoDB-flavored AppConfigs for contrib apps
│   └── mongo_migrations/           # MongoDB-specific migrations for admin/auth/contenttypes
├── vercel.json                    # Vercel deployment config
└── build_files.sh                 # Vercel build script (install, collectstatic, migrate, seed)
```

## Design notes

- Color/type system: dark terminal palette (`#0a0e0f` background, `#00ff9c` phosphor-green accent), JetBrains Mono for terminal/labels, Inter for body copy.
- The terminal is functional, not decorative — it's your actual site navigation.
- `prefers-reduced-motion` is respected: the 3D background, card tilt, and skills graph all disable/reduce animation if the user has that OS setting on.

## Deployment

This project is configured for **Vercel**, using `vercel.json` + `build_files.sh`. On Vercel, set these environment variables in your project settings (not committed to the repo):

- `MONGO_URI` — your MongoDB connection string (required for production; without it the app falls back to SQLite, which won't persist on serverless platforms)
- `MONGO_DB_NAME` — optional, defaults to `portfolio`
- `SECRET_KEY` — a production secret key (a dev default is used otherwise — fine for personal projects, but worth setting)
- `DEBUG` — set to `False` in production
- `ALLOWED_HOSTS` — comma-separated list of allowed hosts (defaults to `.vercel.app,localhost,127.0.0.1`)

Static files are served via [WhiteNoise](http://whitenoise.evans.io/), already wired into `MIDDLEWARE` and `STORAGES` in `settings.py`.
