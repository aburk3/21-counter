from django.urls import path

from gameplay.views import (
    SessionActionView,
    SessionBetView,
    SessionCreateView,
    SessionDealView,
    SessionDetailView,
    SessionExitView,
    SessionNextRoundView,
    SessionSubmitCountView,
)

urlpatterns = [
    path("sessions", SessionCreateView.as_view(), name="session-create"),
    path(
        "sessions/<int:session_id>", SessionDetailView.as_view(), name="session-detail"
    ),
    path("sessions/<int:session_id>/bet", SessionBetView.as_view(), name="session-bet"),
    path(
        "sessions/<int:session_id>/deal", SessionDealView.as_view(), name="session-deal"
    ),
    path(
        "sessions/<int:session_id>/action",
        SessionActionView.as_view(),
        name="session-action",
    ),
    path(
        "sessions/<int:session_id>/round/submit-count",
        SessionSubmitCountView.as_view(),
        name="session-submit-count",
    ),
    path(
        "sessions/<int:session_id>/next-round",
        SessionNextRoundView.as_view(),
        name="session-next",
    ),
    path(
        "sessions/<int:session_id>/exit", SessionExitView.as_view(), name="session-exit"
    ),
]
