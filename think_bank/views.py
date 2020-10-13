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
            return HttpResponse("a6d0d81e")
        if (type == 'message_new'):
            message = data['object']
            user_id = message['user_id']
            # post = message['data']
            print(user_id, message)
            return HttpResponse('Success')
        return HttpResponse("a6d0d81e")
    return HttpResponse("Wrong request")
