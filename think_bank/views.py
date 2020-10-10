from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse

# Create your views here.


@csrf_exempt
def Bot(request):
    if request.method == 'POST':
        print(request.POST.get('type'))
        print('INEEDHELP')
        print('Post: "%s"' % request.POST)
        print('Body: "%s"' % request.body)
        return HttpResponse("dcf1fa33")
    print(request)
    print('IAMRETARDED')
    return HttpResponse("dcf1fa33")
