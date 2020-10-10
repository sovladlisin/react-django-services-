from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse

# Create your views here.


@csrf_exempt
def Bot(request):
    if request.method == 'POST':
        print(request.POST.get('type'))
        print('INEEDHELP')
        print('Post: "%s"' % request.POST)
        print('Body: "%s"' % request.body)
        print('Body: "%s"' % request.body['type'])
        print('Body: "%s"' % request.body[0]['type'])
        print('Body: "%s"' % request.body[0]['type'])
        print(json.loads(request.body))
        print(json.loads(request.body)['type'])

        return HttpResponse("dcf1fa33")
    print(request)
    print('IAMRETARDED')
    return HttpResponse("dcf1fa33")
