from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from .api import add_post_to_db
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
            text = message.get('body', None)
            attachments = message.get('attachments', None)
            print(user_id, text, attachments, message)
            if attachments is not None:
                if attachments[0]['type'] == 'wall':
                    wall = attachments[0]['wall']
                    post_id = wall['id']
                    add_post_to_db(True, post_id, user_id, text)
            if text is not None:
                post_id = text
                add_post_to_db(False, post_id, user_id, None)
            return HttpResponse('Success')
        return HttpResponse("a6d0d81e")
    return HttpResponse("Wrong request")
