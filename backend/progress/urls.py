from django.urls import path

from progress.views import DashboardView, PracticeRunStartView, PracticeRunSubmitView

urlpatterns = [
    path("dashboard", DashboardView.as_view(), name="dashboard"),
    path("practice/runs/start", PracticeRunStartView.as_view(), name="practice-run-start"),
    path(
        "practice/runs/<int:run_id>/submit",
        PracticeRunSubmitView.as_view(),
        name="practice-run-submit",
    ),
]
