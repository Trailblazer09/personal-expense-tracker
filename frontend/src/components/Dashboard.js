import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Pie} from 'react-chartjs-2'
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const userId = localStorage.getItem("userId");
  const [expenses, setExpenses] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7daysTotal, setLast7DaysTotal] = useState(0);
  const [last30daysTotal, setLast30DaysTotal] = useState(0);
  const [currentYearTotal, setCurrentYearTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const pieData ={
    labels: expenses.map(exp => exp.ExpenseItem),
    datasets:[
      {
       label:'Rs',
       data: expenses.map(exp=> parseFloat(exp.ExpenseCost)),
       backgroundColor: [
        'red',
        'blue',
        '#00ff00',
        'rgba(224, 64, 133, 0.5)',
        'rgba(222, 240, 22, 0.5)',
        'rgba(133, 255, 245, 1)',
        'rgba(0, 166, 237, 0.72)',
        'rgba(2, 2, 1, 0.99)',
        'rgba(255, 166, 0, 0.9)'
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fetchExpenses(userId);
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(
  `${process.env.REACT_APP_API_URL}/api/manage_expense/${userId}`
);
      const data = await response.json();
      setExpenses(data);
      calculateTotals(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const calculateTotals = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);
    const currentYear = today.getFullYear();

    let todaySum = 0,
      yesterdaySum = 0,
      last7Sum = 0,
      last30Sum = 0,
      yearSum = 0,
      grandSum = 0;

    data.forEach((item) => {
      const expenseDate = new Date(item.ExpenseDate);
      const amount = parseFloat(item.ExpenseCost) || 0;
      if (expenseDate.toDateString() === today.toDateString()) {
        todaySum += amount;
      }
      if (expenseDate.toDateString() === yesterday.toDateString()) {
        yesterdaySum += amount;
      }
      if (expenseDate >= last7Days) {
        last7Sum += amount;
      }
      if (expenseDate >= last30Days) {
        last30Sum += amount;
      }
      if (expenseDate.getFullYear() === currentYear) {
        yearSum += amount;
      }
      grandSum += amount;
    });
    setTodayTotal(todaySum);
    setYesterdayTotal(yesterdaySum);
    setLast7DaysTotal(last7Sum);
    setLast30DaysTotal(last30Sum);
    setCurrentYearTotal(yearSum);
    setGrandTotal(grandSum);
  };

  return (
    <div className="container mt-4">
      <div className="text-center">
        <h2>Welcome, {userName}!</h2>
        <p className="text-muted">Here is your expense overview</p>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div
            class="card bg-primary text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Today's Expense
              </h5>
              <p className="card-text fs-4">₹{todayTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            class="card bg-success text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-minus me-2"></i>Previous Day
                Expense
              </h5>
              <p className="card-text fs-4">{yesterdayTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            class="card bg-danger text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-week me-2"></i>Last 7 Days
              </h5>
              <p className="card-text fs-4">₹ {last7daysTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            class="card bg-warning text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-alt me-2"></i>Last 30 Days{" "}
              </h5>
              <p className="card-text fs-4">₹ {last30daysTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            class="card bg-secondary text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar me-2"></i>Current Year
              </h5>
              <p className="card-text fs-4">₹ {currentYearTotal}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card bg-primary text-white text-center mb-3"
            style={{ height: "150px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-wallet me-2"></i> Grand Total
              </h5>
              <p className="card-text fs-4">₹ {grandTotal}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5" style={{ width: '400px', height: '400px', margin: 'auto' }}>
  <h4 className="text-center">Expense Distribution</h4>
  {expenses.length === 0 ? (
    <div className="text-muted text-center mt-3">
      <p>No expenses found.</p>
    </div>
  ) : (
    <Pie data={pieData} />
  )}
</div>
    </div>
  );
};

export default Dashboard;
