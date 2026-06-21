from django.contrib import admin
from .models import Experience, ExperienceHighlight, Project, ProjectHighlight, Skill


class ExperienceHighlightInline(admin.TabularInline):
    model = ExperienceHighlight
    extra = 1


class ProjectHighlightInline(admin.TabularInline):
    model = ProjectHighlight
    extra = 1


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'start_date', 'end_date', 'order')
    inlines = [ExperienceHighlightInline]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_stack', 'date_range', 'order')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectHighlightInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'order')
    list_filter = ('category',)
