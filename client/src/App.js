import Login from './components/Login';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfessorPage from './pages/ProfessorPage';
import StudentPage from './pages/StudentPage';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = jwt_decode(token);
        setIsLoggedIn(true);
        setIsProfessor(data.userType == 2);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const onSignIn = (enteredEmail, enteredPassword, fname, lname) => {
    console.log(enteredEmail)
    let usertype = 0;
    if (enteredEmail.match(/^[A-Za-z0-9._%+-]+@stud.ase.ro$/g)) usertype = 1;
    if (enteredEmail.match(/^[A-Za-z0-9._%+-]+@ie.ase.ro$/g)) usertype = 2;
    if (enteredEmail.match(/^[A-Za-z0-9._%+-]+@csie.ase.ro$/g)) usertype = 2;
    if (enteredEmail.match(/^[A-Za-z0-9._%+-]+@ase.ro$/g)) usertype = 2;
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: enteredEmail,
        password: enteredPassword,
        firstName: fname,
        lastName: lname,
        usertypeId: usertype,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Utilizator inregistrat', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error();
        }
      })
      .catch((e) => toast.error("Date incorecte", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));
  };
  const onLogin = (enteredEmail, enteredPassword) => {
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: enteredEmail,
        password: enteredPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Succes', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return response.json();
        } else {
          throw new Error('Email sau parola gresite!');
        }
      })
      .then((data) => {
        if (data.message) {
          if (enteredEmail.split('@')[1] === 'stud.ase.ro') {
            setIsProfessor(false);
          } else setIsProfessor(true);
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
        }
      })
      .catch((e) => toast.error("Email / parola gresita!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }))
  };
  const onLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsProfessor(false);
    toast.success('Delogare cu succes!', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <div className='main'> <ToastContainer />
      {isLoggedIn ? <Navbar onLogout={onLogout} isLoggedIn={isLoggedIn} /> : ''}
      {isLoggedIn === false ? <Login onLogin={onLogin} onSignIn={onSignIn} /> : ''}{' '}
      {isLoggedIn && isProfessor ? <ProfessorPage /> : ''}
      {isLoggedIn && !isProfessor ? <StudentPage /> : ''}
    </div>
  );
}

export default App;
