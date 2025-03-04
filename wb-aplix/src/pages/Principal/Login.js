import React, { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import logo2 from '../../img/WB.png';
import '../../css/Login.css';
import env from '../../env-config'; // Importa las variables de entorno


function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(env.API_URL+'Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ User: username, Pass: password }),
      });

      const data = await response.json();

      if (data && data.length > 0) {
        let company = data[0].EMPRESA;
        sessionStorage.setItem('loginUser',username) ;
        sessionStorage.setItem('compañia', company.toLowerCase());

        if(company.toLowerCase() === "aplix"){
          window.location.href = '/SUHome';
        }
        else{
          window.location.href = '/Home';
        }

        
      } else {
        setErrorMessage('Error al iniciar sesión, revise el usuario y la contraseña');
      }
    } catch (error) {
      console.log('Error:', error.message);
      setErrorMessage('Error al conectar con el servidor');
    }
  };



  useEffect(() => {
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('compañia');
  }, []);

  return (
    <div className={`loginContainer ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form loginForm" onSubmit={handleLogin}>
            <h2 className="title">Iniciar Sesión</h2>

            <div className="input-field">
              <FontAwesomeIcon icon={faEnvelope} className='my-auto mx-auto InputIcon' />
              <input
                className='LoginInput'
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-field">
              <FontAwesomeIcon icon={faLock} className='my-auto mx-auto InputIcon' />
              <input
                className='LoginInput'
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="password-toggle-btn" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className='btn' type="submit">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
          </div>
          <img src={logo2} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3 className='loginh3'>¿Desea Iniciar Sesión?</h3>
            <p className='loginp'>
              Haga click en el siguiente botón para dirigirse a la pestaña de inicio de sesión en el sistema.
            </p>
            <button onClick={handleSignInClick} className="btn transparent" id="sign-in-btn">
              Iniciar Sesión
            </button>
          </div>
          <img src={logo2} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
