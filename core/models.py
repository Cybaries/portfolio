from django.db import models


class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.CharField(max_length=50)   # e.g. "May 2024"
    end_date = models.CharField(max_length=50, default="Present")
    summary = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.role} @ {self.company}"


class ExperienceHighlight(models.Model):
    experience = models.ForeignKey(Experience, related_name='highlights', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)        # e.g. "Core Architecture Migration"
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=300, blank=True)
    tech_stack = models.CharField(max_length=300)  # comma separated, e.g. "Node.js, Express, MongoDB"
    date_range = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    github_url = models.URLField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def tech_list(self):
        return [t.strip() for t in self.tech_stack.split(',') if t.strip()]


class ProjectHighlight(models.Model):
    project = models.ForeignKey(Project, related_name='highlights', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('language', 'Language'),
        ('backend', 'Backend Framework'),
        ('frontend', 'Frontend'),
        ('database', 'Database'),
        ('tool', 'Tool / Methodology'),
        ('core', 'Core Competency'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['category', 'order']

    def __str__(self):
        return self.name
