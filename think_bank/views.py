from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import VkUser
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from .api import add_post_to_db, vk_request
import random
# Create your views here.
key = 'test_key_2138573p9148'


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
                    post_id = str(wall['from_id']) + '_' + str(wall['id'])
                    add_post_to_db(True, post_id, user.pk, text)
            if text is not None:
                post_id = text
                add_post_to_db(False, post_id, user.pk, None)
            return HttpResponse('ok', content_type="text/plain", status=200)
        return HttpResponse('ok', content_type="text/plain", status=200)
    return HttpResponse('ok', content_type="text/plain", status=200)


def send_message(message, user_id):
    community_token = 'cd4bb7c9e5628b5c7d513f91cc4bc20f0adf5bcdafcca02009f00aa092088ec7e8cabd78eb7e2959f6949'
    rand = random.randint(-32768, 32767)
    answer = vk_request('get', 'messages.send', {
                        'peer_id': user_id, 'message': message, 'random_id ': rand}, community_token)
