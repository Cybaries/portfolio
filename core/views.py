from django.shortcuts import render
from .models import Experience, Project, Skill


CATEGORY_LABELS = {
    'language': 'Language',
    'backend': 'Backend',
    'frontend': 'Frontend',
    'database': 'Database',
    'tool': 'Tool',
    'core': 'Core',
}


def home(request):
    skills = Skill.objects.all()
    skills_json = [
        {
            'name': s.name,
            'category': s.category,
            'category_label': CATEGORY_LABELS.get(s.category, s.category),
        }
        for s in skills
    ]
    context = {
        'experiences': Experience.objects.prefetch_related('highlights').all(),
        'projects': Project.objects.prefetch_related('highlights').all(),
        'skills': skills,
        'skills_json': skills_json,
    }
    return render(request, 'core/home.html', context)
