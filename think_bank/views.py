from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse

# Create your views here.


@csrf_exempt
def Bot(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        type = data['type']
        if (type == 'confirmation'):
            return HttpResponse("dcf1fa33")
        if (type == 'message_new'):
            print(data)
            return HttpResponse('Success')
        return HttpResponse("dcf1fa33")
    return HttpResponse("Wrong request")
