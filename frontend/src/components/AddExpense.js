import React, { useState, useEffect} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const navigate= useNavigate();
        const [formData,setFormData] = useState({
            ExpenseDate:'', 
            ExpenseItem:'', 
            ExpenseCost:'',
        });

       const userId = localStorage.getItem('userId');
       useEffect(()=>{
       if(!userId){
        navigate('/login');
        }
       },[]);
        const handleChange = (e) => {
            setFormData({...formData,[e.target.name]:e.target.value});
        };
        
        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/add_expense/`,  {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        ...formData, 
                        UserId:userId
                    })
                });
                const data = await response.json();
                if(response.status===201) {
                    toast.success(data.message);
                    setTimeout(()=> {
                        navigate('/dashboard');
                    },2000);
                }
                else {
                    
                    toast.error(data.message);
                }
            }
                catch(error){
                    console.error('Error:', error);
                    toast.error('Something went wrong. Try again!!');
                }
            
        };
  return (
    <div className='container mt-5'>
        <div className='text-center mb-4'>
           <h2><i className = 'fas fa-plus-circle me-2'></i> Add Expense</h2>
          <p className ='text-muted'>Track your recent spending activity here</p>
        </div>

        <form className='p-4 rounded shadow mx-auto' style={{maxWidth:'400px'}} onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label className='form-label'>Expense Date</label>
                <div className ='input-group'>
                    <span className="input-group-text">
                        <i className="fas fa-calendar-alt"></i>
                    </span>
                 <input type="date" name="ExpenseDate" value={formData.ExpenseDate} className='form-control' onChange={handleChange} required/>
                </div>
            </div>

        <div className='mb-3'>
                <label className='form-label'>Expense Item</label>
                <div className ='input-group'>
                    <span className="input-group-text">
                        <i className="fas fa-shopping-cart"></i>
                    </span>
                 <input type="text" name="ExpenseItem" value={formData.ExpenseItem} className='form-control' onChange={handleChange} required placeholder ='eg. groceries, recharge, petrol etc.'/>
                </div>
            </div>

            <div className='mb-3'>
                <label className='form-label'>Expense Cost(₹)</label>
                <div className ='input-group'>
                    <span className="input-group-text">
                        <i className="fas fa-rupee"></i>
                    </span>
                 <input type="number" name="ExpenseCost" value={formData.ExpenseCost}  onChange={handleChange} className='form-control' required placeholder ='amount spent?'/>
                </div>
            </div>
            <button type="submit" className='btn btn-primary w-100 mt-3'><i className="fas fa-plus-circle me-2"></i>ADD EXPENSE</button>

        </form>
        <ToastContainer/>
      
    </div>

  )
}

export default AddExpense
