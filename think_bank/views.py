from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import VkUser
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
            user = VkUser.objects.all().filter(user_id=user_id).first()
            text = message.get('body', None)
            attachments = message.get('attachments', None)
            if attachments is not None:
                if attachments[0]['type'] == 'wall':
                    wall = attachments[0]['wall']
                    print(wall)
                    post_id = str(wall['from_id']) + '_' + str(wall['id'])
                    print("Запрос:::", post_id, user.pk, text)
                    add_post_to_db(True, post_id, user.pk, text)
            if text is not None:
                post_id = text
                print("Запрос:::", post_id, user.pk, text)
                add_post_to_db(False, post_id, user.pk, None)
            return HttpResponse('Success')
        return HttpResponse("a6d0d81e")
    return HttpResponse("Wrong request")
