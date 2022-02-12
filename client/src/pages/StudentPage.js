import { useState, useEffect, useRef } from 'react';
import Feedback from '../components/Feedback';
import { toast } from 'react-toastify';
import moment from 'moment';

function StudentPage() {
  const [createFeedback, setCreateFeedback] = useState(false);
  const [createdFeedback, setCreatedFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activity, setActivity] = useState();
  const [showHome, setShowHome] = useState(false);
  const [student, setStudent] = useState();

  const cod = useRef();
  const descriere = useRef();
  const tip = useRef();
  const current = new Date();
  const date = `${current.getDate()}:${current.getMonth() + 1}:${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
  const getActivities = (student) => {
    fetch(`http://localhost:3001/activities`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let activity2 = null;
        data.map(a => {
          if (a.code == cod.current.value) {
            setActivity(a)
            activity2 = a;
            let introdusa = moment(activity2.date, moment.ISO_8601,true);
            let curenta = moment(date, "DD:M:YYYY HH:mm:ss",true);
            let dif = introdusa - curenta;
           console.log(`data activitatii ${activity2.date}, curenta ${date} si dif ${dif}`)
           console.log(`data activitatii ${introdusa}, curenta ${curenta} si dif ${dif}`)
           if(dif<(-432000000)) {
            toast.error("Activitate s-a terminat!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            console.log('a trecut')
            setActivity(null)
            return;
           }
           else if(dif>432000000) {
            console.log('n-a inceput')
            toast.error("Activitate nu a inceput!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            setActivity(null)
            return;
           }
           console.log('ok')
            /**data activitatii 2022-01-18T12:41:00.000Z, curenta 18:1:2022 15:29:28 si dif NaN */
            fetch(`http://localhost:3001/users/${student.id}/activities/${activity2.id}/enroll`, {
              method: 'POST',
              headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
              },
            }).then(() => toast.success('Inrolare cu succes!', {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }));
          }
        }); if (activity2 == null)
          toast.error("Activitate inexistenta!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
      }).catch((e) => toast.error("Date incorecte", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));;
  };
  const getBackendData = () => {
    fetch('http://localhost:3001/logged', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.dataValues);
        console.log(data.dataValues);
      }).catch((e) => toast.error("Date incorecte", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));;
  };

  const addedFeedback = (
    <div className="page-content">
      <div className="professors-display row col-xs-12">
        <div className="title">
          <h1>Feedbackul a fost transmis!</h1></div>
        <div className="professor-list row">
          <img src={'https://media.istockphoto.com/photos/gray-abstract-minimal-motion-backgrounds-loopable-elements-4k-picture-id1174989482?b=1&k=20&m=1174989482&s=170667a&w=0&h=ld7ukW9KTzUlJLc6c37C2xs5ESYP2wLyjxsEVCumn2s='} className="prof-background"></img>
          <div className="professor-cards row" >
            {feedbacks.map((feedback, i) => (
              <Feedback key={i}
                feedback={feedback}
                i={i + 1}
              />
            ))}
            <div width='100%' onClick={showForm} className='circleplus'>
              <svg width="123" height="122" viewBox="0 0 63 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="31.5" cy="31" rx="31.5" ry="31" fill="white">  </ellipse>
                <path id='totranslate' d="M20.6875 12.5312H31.9688V20.6875H20.6875V33.4375H12.0938V20.6875H0.78125V12.5312H12.0938V0.3125H20.6875V12.5312Z" fill="black" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const postFeedback = (stud, activity) => {
    if (activity == null) {
      toast.error("Introdu activitate valida!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    console.log(date)
    if (!date || !tip.current.value || !descriere.current.value || !cod.current.value) {
      toast.error('Completeaza datele!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    fetch(`http://localhost:3001/feedbacks/users/${stud.id}/activities/${activity.id}`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: new Date(current.getFullYear(),current.getMonth(),current.getDate(),current.getHours(),current.getMinutes(),current.getSeconds())        ,
        description: descriere.current.value,
        type: tip.current.value,
      }),
    }).then(() => {
      toast.success('Feedback transmis!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetch(`http://localhost:3001/feedbacks`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFeedbacks(data)
          console.log(data)
          showFeedback();
        }).catch((e) => toast.error("Date incorecte", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }));
    }).catch((e) => toast.error("Introdu activitate valida!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }));
  };

  useEffect(() => {
    getBackendData();
  }, []);
  function showFeedback() {
    setCreatedFeedback(true)
    setCreateFeedback(false)
  }
  function showForm() {
    setCreatedFeedback(false)
    setCreateFeedback(true)
    setShowHome(false)
  }

  const showAddFeedback = (
    <div id="container">
      <h1>Trimitere feedback</h1>
      <br />
      <label htmlFor="id"><b>COD Activitate</b></label>
      <br />
      <input type="text" ref={cod} placeholder="Introduceti codul" name="ID" id="ID" required=""></input> <br />
      <button type="submit" class="custombtn" onClick={() => {
        getActivities(student)
      }}>Inrolare activitate</button> <br />
      <label htmlFor="descriere"><b>Descriere Feedback</b></label> <br />
      <input type="text" ref={descriere} placeholder="Introduceti o descriere" name="descriere" id="descriere" required=""></input> <br />
      <label htmlFor="emoji"><b>Selecteaza tipul de emoji pe care dorești să-l oferi activității!</b></label>  <br />
      <select ref={tip} name="wgtmsr" id="selectImoji">
        <option value="EXCELENT">Excelent 💓</option>
        <option value="GOOD">Good 😀</option>
        <option value="AVERAGE">Average 🙁</option>
        <option value="POOR">Poor 😣</option>
      </select> <br />
      <button type="submit" class="custombtn" onClick={() => {
        postFeedback(student, activity)
      }}>Trimitere feedback</button>
    </div>
  );


  const studPage = (
    <div id="container">
      <h1>Salut, bine ai revenit,  {student && student.firstName + ' ' + student.lastName}!</h1>
      <h3>Dorești să te inrolezi intr-o activitate noua?</h3>
      <button type="button" class="custombtn" onClick={showForm}>Inrolare activitate</button>
    </div>
  );

  return (
    <div >
      {createFeedback ? showAddFeedback : studPage}
      {showHome ? studPage : 'nne'}
      {createdFeedback ? addedFeedback : 'none'}
    </div>
  );
}

export default StudentPage;
