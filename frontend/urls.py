from django.urls import path, include
from . import views
from django.conf.urls import url
from django.views.generic import TemplateView

REACT_ROUTES = [
    'service-list',
    'think-bank',
    'post/',
    r'^post/(?P<user>\d+)/(?P<id>\d+)/$',
    'userbank/',
    r'^userbank/(?P<userbankid>\d+)/$',
]

urlpatterns = [
    path('', views.index),
    url(r'^(%s)?$' % '|'.join(REACT_ROUTES),
        TemplateView.as_view(template_name='frontend/index.html')),
]
