from django.urls import path
from django.http import JsonResponse
from .views import *
def test_api(request):
    return JsonResponse({"message": "API is working"})



urlpatterns = [
    path('', test_api),
    path('signup/', signup, name="signup"),
    path('login/', login, name="login"),
    path('add_expense/',add_expense, name="add_expense"),
    path('manage_expense/<int:user_id>/',manage_expense, name="manage_expense"),
    path('update_expense/<int:expense_id>/',update_expense, name="update_expense"),
    path('delete_expense/<int:expense_id>/',delete_expense, name="delete_expense"),
    path('search_expense/<int:user_id>/',search_expense, name="search_expense"),
    path('change_password/<int:user_id>/',change_password, name="change_password"),
]

