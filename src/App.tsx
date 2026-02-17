import './App.css';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router';
import LoginPage from './pages/loginPage'
import MainPage from './pages/mainPage'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path='main'  element={< MainPage />} />
        
        {/* 
        <Route path='companies' element={<CompanyPages />}/>
        <Route path='users' element={<UnapprovalUsersPage />}/>
        <Route path="events" >
              <Route index element={<EventsPage />} />   
              <Route path=":eventId" element= { < DetailedEventPage/>} />
        </Route> */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
