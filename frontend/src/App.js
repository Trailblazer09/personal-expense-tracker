
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ManageExpense from './components/ManageExpense';
import ExpenseReport from './components/ExpenseReport';
import ChangePassword from './components/ChangePassword';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          {/* Redirect root path to Signup 
          <Route path="/" element={<Navigate to="/signup" replace />} /> */}

          <Route path="/" element={<Home />} />

          {/* Signup page route */}
          <Route path="/signup" element={<Signup />} />

          {/* Login page route */}
          <Route path="/login" element={<Login />} />

            {/* Dashboard page route */}
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/add-expense" element={<AddExpense />} />
           <Route path="/manage-expense" element={<ManageExpense />} />
           <Route path="/expense-report" element={<ExpenseReport />} />
           <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;