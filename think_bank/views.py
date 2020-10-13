from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from .models import VkUser
from django.http import StreamingHttpResponse, HttpResponseRedirect, HttpResponse
from .api import add_post_to_db, vk_request, send_message
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

            filtered_users = VkUser.objects.all().filter(user_id=user_id)
            if filtered_users.count() == 0:
                send_message(
                    'К сожалению вы не зарегистрированы на нашем сервисе.\nДля регистрации пройдите по ссылке: https://vtarget.herokuapp.com/ ', user_id)
                HttpResponse('ok', content_type="text/plain", status=200)

            user = filtered_users.first()
            text = message.get('body', None)
            attachments = message.get('attachments', None)
            if attachments is not None:
                if attachments[0]['type'] == 'wall':
                    wall = attachments[0]['wall']
                    post_id = str(wall['from_id']) + '_' + str(wall['id'])
                    add_post_to_db(True, post_id, user.pk, text)
            if text is not None:
                if text.lower() == 'помощь':
                    send_message('Способы загрузки информации из постов в ваш личный банк:\n1.Отправить прямую ссылку на запись, вида: https://vk.com/XXX?w=wallXXX\n2. Поделиться со мной записью в сообщении\n\nПри возникших проблемах можно написать моему разработчику: https://vk.com/id122058319', user_id)
                post_id = text
                add_post_to_db(False, post_id, user.pk, None)
            return HttpResponse('ok', content_type="text/plain", status=200)
        return HttpResponse('ok', content_type="text/plain", status=200)
    return HttpResponse('ok', content_type="text/plain", status=200)
