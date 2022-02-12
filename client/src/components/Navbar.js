import logo from "../media/logo-2.svg"

function Navbar(props) {
  return (
    <nav className="navbar navbar-dark bg-dark justify-content-between sticky-top" id="navbar">
      <div className="nav-left">
        <img src={logo} id="logo"></img>
        <a className="title-app">Continous Feedback App</a>
        <a onClick={() => (window.location.href = '/')} className="nav-item">Home</a>
        {props.isLoggedIn && (
          <a
            id='btnLogOut'
            onClick={props.onLogout}
            href='/#'
          >
            Logout
          </a>
        )}{' '}
      </div>
    </nav>
  );
};

export default Navbar;
