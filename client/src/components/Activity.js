
import book from "../media/onlineclass.svg";
function Activity(props) {
    return (
    <div 
  className="card col-xs-12 col-sm-4 col-lg-4">
      <img className="card-img-top" src={book} alt="Card image cap"></img>
      <div className="card-body">
          <h5 className="card-title">{props.activity.code} - {props.activity.description}</h5>
      </div>
  </div>
    );
  }
  export default Activity;
  