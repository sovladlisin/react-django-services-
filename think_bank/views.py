from django.shortcuts import render

from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse

# Create your views here.


def Bot(request):
    print(request)
    print('IAMRETARDED')
    return HttpResponse("dcf1fa33")
