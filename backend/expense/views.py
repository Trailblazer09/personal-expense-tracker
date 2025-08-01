from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

#Signup API
@csrf_exempt
def signup(request):
    if request.method == 'POST':
     data = json.loads(request.body)
     print("Incoming request data:", data)
     fullname = data.get('FullName')
     email = data.get('Email')
     password = data.get('Password')

     if UserDetail.objects.filter(Email=email).exists():
        return JsonResponse({'message':'Email already exists'},status=400)
     UserDetail.objects.create(FullName = fullname, Email= email, Password = password)
     return JsonResponse({'message':'User registered successfully'},status=201)
   
   
#Login API   
@csrf_exempt
def login(request):
    if request.method == 'POST':
     data = json.loads(request.body)
     
     email = data.get('Email')
     password = data.get('Password')

     try:
        user = UserDetail.objects.get(Email=email, Password=password)
        return JsonResponse({'message':'Login Successful!','userId': user.id, 'userName':user.FullName},status=200)
     except:
       return JsonResponse({'message':'Invalid Credentials'},status=400)
     
#add expense api
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
     data = json.loads(request.body)

     user_id = data.get('UserId')
     expense_date = data.get('ExpenseDate')
     expense_item = data.get('ExpenseItem')
     expense_cost = data.get('ExpenseCost')

     
     user = UserDetail.objects.get(id = user_id)
     
     try:
        Expense.objects.create(UserId=user,ExpenseDate=expense_date,ExpenseItem=expense_item,ExpenseCost=expense_cost)
        return JsonResponse({'message':'Expense added successfully'},status=201)
     except Exception as e:
       return JsonResponse({'message':'Something went wrong','error':(str(e))},status=400)

#manage-expense api
@csrf_exempt
def manage_expense(request, user_id):
    if request.method == 'GET':      
     expenses = Expense.objects.filter(UserId=user_id)
     expense_list = list(expenses.values())
     return JsonResponse(expense_list, safe = False)
    
    #edit-expense api
@csrf_exempt
def update_expense(request, expense_id):
    if request.method == 'PUT':
    
     data = json.loads(request.body)
     expense_date = data.get('ExpenseDate')

    try:  
     expense = Expense.objects.get(id=expense_id)
     expense.ExpenseDate = data.get('ExpenseDate', expense.ExpenseDate)
     expense.ExpenseItem = data.get('ExpenseItem', expense.ExpenseItem)
     expense.ExpenseCost = data.get('ExpenseCost', expense.ExpenseCost)
     expense.save()
     return JsonResponse({'message': 'Expense updated successfully!'})
    except:
     return JsonResponse({'message': 'Expense not found'},status=400)
    
#delete_expense api

@csrf_exempt
def delete_expense(request, expense_id):
  if request.method == 'DELETE':  

    try:  
     expense = Expense.objects.get(id=expense_id)
     
     expense.delete()
     return JsonResponse({'message': 'Expense deleted successfully!'}, status=200)
    except:
     return JsonResponse({'message': 'Expense not found'},status=400)
     
  #search_expense api & dates are inclusive
from django.db.models import Sum
@csrf_exempt
def search_expense(request, user_id):
    if request.method == 'GET':    
     from_date = request.GET.get('from')
     to_date = request.GET.get('to')  
     expenses = Expense.objects.filter(UserId=user_id,ExpenseDate__range=[from_date,to_date])
     expense_list = list(expenses.values())
     agg = expenses.aggregate(Sum('ExpenseCost')) 
     total = agg['ExpenseCost__sum'] or 0
     return JsonResponse({'expenses':expense_list,'total':total})
    
#change password api
 
@csrf_exempt
def change_password(request, user_id):
    if request.method == 'POST':
     data = json.loads(request.body)

    old_password = data.get('oldPassword')
    new_password = data.get('newPassword') 
      
     
    try:
     user = UserDetail.objects.get(id = user_id)
     if user.Password != old_password:
       return JsonResponse({'message':'Old password is incorrect'},status=400)
     user.Password = new_password
     user.save()
     return JsonResponse({'message':'Password changed successfully'},status=200)
    except:
      return JsonResponse({'message':'User not found',},status=404)

   
