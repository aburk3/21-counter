from django.urls import path

from progress.views import DashboardView

urlpatterns = [
    path("dashboard", DashboardView.as_view(), name="dashboard"),
]
