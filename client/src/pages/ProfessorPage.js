import { useState, useEffect, useRef } from 'react';
import Activity from '../components/Activity';
import { toast } from 'react-toastify';
import moment from 'moment';

function ProfessorPage() {
  const [createActivity, setCreateActivity] = useState(false);
  const [createdActivity, setCreatedActivity] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [professor, setProfessor] = useState();
  const [activities, setActivities] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [arrayTypes, setArrayTypes] = useState([]);
  const cod = useRef();
  const codPtFeedback = useRef();
  const descriere = useRef();
  const date = useRef();
  const current = new Date();
  const currentDate = `${current.getDate()}:${current.getMonth() + 1}:${current.getFullYear()}`;

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
        setProfessor(data.dataValues)
      });
  };
  const getAllExistentActivities = (prof) => {
    let introdusa = moment(date.current.value, moment.ISO_8601, true);
    let curenta = moment(currentDate, "DD:M:YYYY HH:mm:ss", true);
    let dif = introdusa - curenta;
    if (dif < 0) {
      toast.error("Data nu poate fi in trecut!", {
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
    if (!cod.current.value || !descriere.current.value || !date.current.value) {
      toast.error("Completati campurile!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } else if (date.current.value < currentDate) {
      toast.error("Data invalida!", {
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
    fetch(`http://localhost:3001/activities`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
      .then((data) => {
        console.log(data)
        for (let a of data) {
          if (a.code == cod.current.value) {
            toast.error("Exista activitate cu acest cod!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            return;
          }
        }
        console.log('ok')
        makeRequest(prof)
      })
      .catch((e) => { 
        makeRequest(prof) });
  };
  const makeRequest = (prof) => {
    fetch(`http://localhost:3001/activities/${prof.id}`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date.current.value,
        description: descriere.current.value,
        code: cod.current.value,
      }),
    }).then((res) => {
      if (res.status == 400) {
        toast.error("Nu s-a creat activitatea!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }); return;
      } getAllActivities(professor);
      toast.success("S-a creat activitatea!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      showActivity();
    })
      .catch((e) => toast.error("Nu s-a creat activitatea!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));
  };
  const getAllActivities = (prof) => {
    fetch(`http://localhost:3001/activities/users/${prof.id}`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
      .then((data) => {
        setActivities(data)
        console.log(data[0])
      }).catch((e) => toast.error("Nu s-au putut prelua activitatile!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));
  };

  const getFeedbackOfActivity = (activity) => {
    let id;
    if (!activity) {
      activities.map(a => {
        console.log(codPtFeedback.current.value)
        if (a.code == codPtFeedback.current.value) {
          id = a.id;
        }
      })
    } else id = activity.id;
    console.log(id)
    fetch(`http://localhost:3001/feedbacks/activity/${id}`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
      .then((data) => {
        setFeedbacks(data)
        let e = 0, g = 0, a = 0, p = 0;
        for (let f of data) {
          if (f.type == 'EXCELENT') {
            e++;
          } else if (f.type == 'GOOD') {
            g++;
          } else if (f.type == 'AVERAGE') {
            a++;
          } else if (f.type == 'POOR') {
            p++
          }
        }
        let array = [e, g, a, p];
        setArrayTypes(array);
      }).catch(() => {
        let array = [0, 0, 0, 0];
        setArrayTypes(array); toast.warn("Nu sunt feedback-uri!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      });
  };

  useEffect(getBackendData, []);


  function showForm() {
    setCreatedActivity(false)
    setCreateActivity(true)
    setShowHome(false)
    setShowFeedback(false)
  }
  function showActivity() {
    setCreatedActivity(true)
    setCreateActivity(false)
    setShowFeedback(false)
    setShowHome(false)
  }
  function showFeedbackPage() {
    setCreatedActivity(false)
    setCreateActivity(false)
    setShowHome(false)
    setShowFeedback(true)
  }

  const showAddActivityPage = (
    <div id="container">
      <h1>Creare activitate</h1><br />
      <label htmlFor="cod"><b>Cod Activitate</b></label><br />
      <input type="descriere" placeholder="Introduceti cod" ref={cod} name="cod" id="cod" required></input><br />

      <label htmlFor="descriere"><b>Descriere Activitate</b></label><br />
      <input type="descriere" placeholder="Introduceti descriere" ref={descriere} name="descriere" id="descriere" required></input><br />

      <label htmlFor="date"><b>Data activitate</b></label><br />
      <input type="datetime-local" placeholder="Data activitate" ref={date} name="data" id="data" required></input><br />

      <button type="submit" className="custombtn" onClick={() => {
        getAllExistentActivities(professor)
      }}
      >Creare activitate</button><br />
    </div>
  )
  const profPage = (
    <div id="container">
      <h1>Buna ziua, {professor && professor.firstName + ' ' + professor.lastName}!</h1>
      <br />
      <br />
      <h3>Doriti să creați o activitate noua?</h3>
      <button type="button" className="custombtn" onClick={showForm} >Creare activitate</button>
      <h3>Doriti vedeți activitățile dvs</h3>
      <button type="button" onClick={() => {
        getAllActivities(professor);
        showActivity();
      }} className="custombtn">Vizualizare activități</button>
      <h3>Doriti să revedeți feedback-ul unei activități</h3>
      <button type="button" onClick={() => {
        getAllActivities(professor);
        showFeedbackPage();
      }} className="custombtn">Vizualizare feedback</button>
    </div>)


  const addedActivity = (
    <div className="page-content">
      <div className="professors-display row col-xs-12">
        <div className="title">
          <h1>Activitatile create</h1></div>
        <div className="professor-list row">
          <div className="professor-cards row" >
            {activities.map((activity, i) => (
              <Activity key={i}
                activity={activity}
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
  )

  const feedBackPage = (
    <div id="container">
      <h1>Vizualizare feedback</h1>
      <hr />
      <br />
      <label id="label" htmlFor="idactivitate">COD Activitate:</label><br />
      <input type="text" ref={codPtFeedback} placeholder='cod' id="idactivitate" name="idactivitate"></input><br />
      <button type="button" className="custombtn" onClick={() => getFeedbackOfActivity(null)} >Afisare</button>
      <br /><br />
      <h1>Istoric de feedback</h1>
      <table class='tablefeedback'>
        <thead>
          <tr>
            <th>Data</th>
            <th>💓</th>
            <th>😀</th>
            <th>🙁</th>
            <th>😣</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, i) => (
            <tr>
              <td>{new Date(feedback.date).getHours()}:{new Date(feedback.date).getMinutes()}:{new Date(feedback.date).getSeconds()}</td>
              <td>{feedback.type == 'EXCELENT' ? 'x' : '0'}</td>
              <td>{feedback.type == 'GOOD' ? 'x' : '0'}</td>
              <td>{feedback.type == 'AVERAGE' ? 'x' : '0'}</td>
              <td>{feedback.type == 'POOR' ? 'x' : '0'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td >{arrayTypes[0]}</td>
            <td>{arrayTypes[1]}</td>
            <td>{arrayTypes[2]}</td>
            <td>{arrayTypes[3]}</td>
          </tr>
        </tfoot>

      </table>
    </div>
  );

  return (
    <div id='1' >
      {createActivity ? showAddActivityPage :
        showHome ? profPage :
          showFeedback ? feedBackPage :
            createdActivity ? addedActivity : profPage
      }
    </div>
  )
}

export default ProfessorPage;
