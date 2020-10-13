from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import VkUser
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from .api import add_post_to_db, vk_request
# Create your views here.
key = 'test_key_2138573p9148'


@csrf_exempt
def Bot(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        type = data['type']
        if data['secret'] == key:
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
                        post_id = str(wall['from_id']) + '_' + str(wall['id'])
                        add_post_to_db(True, post_id, user.pk, text)
                if text is not None:
                    post_id = text
                    add_post_to_db(False, post_id, user.pk, None)
                    answer = vk_request('get', 'messages.send', {
                        'peer_id': user_id, 'message': 'test'}, {'token': key})
                    print(answer)
                return HttpResponse('ok', content_type="text/plain", status=200)
            return HttpResponse('wrong')
    return HttpResponse("wrong")
