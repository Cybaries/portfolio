from django.core.management.base import BaseCommand
from core.models import Experience, ExperienceHighlight, Project, ProjectHighlight, Skill


class Command(BaseCommand):
    help = "Seed the database with Aman Kant Jha's resume content"

    def handle(self, *args, **options):
        Experience.objects.all().delete()
        Project.objects.all().delete()
        Skill.objects.all().delete()

        # --- Experience ---
        tcs = Experience.objects.create(
            company="Tata Consultancy Services",
            role="Python Developer — Tata Steel Netherlands Project",
            location="Pune, India",
            start_date="May 2024",
            end_date="Present",
            order=1,
        )
        ExperienceHighlight.objects.bulk_create([
            ExperienceHighlight(
                experience=tcs,
                title="Core Architecture Migration",
                description="Selected as part of the core implementation team tasked with modernizing legacy "
                             "TSN Mainframe infrastructure into a scalable, vendor-based PSI platform using "
                             "C#, PL/SQL & Python.",
                order=1,
            ),
            ExperienceHighlight(
                experience=tcs,
                title="Stakeholder Design Collaboration",
                description="Facilitated regular technical design discussions with cross-functional business "
                             "stakeholders to evaluate, refine, and lock down system requirements for delivery.",
                order=2,
            ),
            ExperienceHighlight(
                experience=tcs,
                title="Hypercare Stability",
                description="Managed high-stakes post-go-live Hypercare phases for 4 production lines, "
                             "debugging integration anomalies and optimizing system stability under production loads.",
                order=3,
            ),
            ExperienceHighlight(
                experience=tcs,
                title="Root Cause Analysis (RCA)",
                description="Primary technical point of contact for complex production anomalies, isolating "
                             "core bugs by tracing through extensive PL/SQL packages and Python scripts.",
                order=4,
            ),
            ExperienceHighlight(
                experience=tcs,
                title="High-Level System Design (HLSD)",
                description="Authored detailed architectural HLSDs derived from vendor-supplied mini-Functional "
                             "Design Specifications, securing sign-offs from the Lead Design Architect.",
                order=5,
            ),
            ExperienceHighlight(
                experience=tcs,
                title="End-to-End Validation (SDLC)",
                description="Led verification cycles — Unit Testing, System Integration Testing, and Regression "
                             "Testing — for critical bug fixes and Change Requests before UAT and production deployment.",
                order=6,
            ),
        ])

        # --- Projects ---
        wa_bot = Project.objects.create(
            title="WhatsApp Automation Bot",
            slug="whatsapp-automation-bot",
            tagline="Microservice-based chatbot automating transactional messaging workflows.",
            tech_stack="Node.js, Express, MongoDB",
            date_range="Jun 2025 – Aug 2025",
            github_url="https://github.com/Cybaries/whatsapp-bot",
            order=1,
        )
        ProjectHighlight.objects.bulk_create([
            ProjectHighlight(
                project=wa_bot,
                title="Backend Automation",
                description="Architected and deployed a microservice-based chatbot using Node.js and Express.js "
                             "to automate transactional messaging workflows.",
                order=1,
            ),
            ProjectHighlight(
                project=wa_bot,
                title="Scalable Data Persistence",
                description="Integrated MongoDB Atlas for cloud-based NoSQL storage, designing high-throughput "
                             "data schemas for user interaction logs and session states.",
                order=2,
            ),
            ProjectHighlight(
                project=wa_bot,
                title="Reliability & Testing",
                description="Implemented error-handling middleware to manage webhook payloads, API rate-limiting, "
                             "and network timeouts.",
                order=3,
            ),
        ])

        # --- Skills ---
        skills = [
            ("Python", "language"), ("Java", "language"), ("SQL (PL/SQL)", "language"),
            ("JavaScript (ES6+)", "language"), ("C/C++", "language"), ("C#", "language"),
            ("Django", "backend"), ("Node.js", "backend"), ("Express.js", "backend"),
            ("REST APIs", "backend"), ("ASP.NET", "backend"),
            ("React", "frontend"), ("HTML5", "frontend"), ("CSS3", "frontend"),
            ("MongoDB", "database"), ("SQLite3", "database"),
            ("Data Structures & Algorithms", "core"), ("OOP", "core"), ("System Design Basics", "core"),
            ("Agile/Scrum", "tool"), ("Git/GitHub", "tool"), ("Jira", "tool"), ("ServiceNow", "tool"),
        ]
        Skill.objects.bulk_create([
            Skill(name=name, category=cat, order=i) for i, (name, cat) in enumerate(skills)
        ])

        self.stdout.write(self.style.SUCCESS("Seeded resume content successfully."))
