import React, { useEffect, useState } from 'react'
import { Link ,useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/authenticationSlice';
import jwt_decode from "jwt-decode";


function UserLogin() {
  
  const [formError, setFormError] = useState([])
  const baseURL='http://127.0.0.1:8000'

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLoginSubmit = async(event)=> {
    event.preventDefault();
    setFormError([])
    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    try {
      const res = await axios.post(baseURL+'/api/accounts/login/', formData)
      if(res.status === 200){
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        console.log(res.data);
        dispatch(
          set_Authentication({
            name: jwt_decode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin:res.data.isAdmin
          })
        );
        navigate('/profile')
        return res
      }  
      
    }
    catch (error) {
      console.log(error);
      if (error.response.status===401)
      {
       
        setFormError(error.response.data)
      }
      else
      {
        console.log(error);
  
      }
    }
  }
  

  return (
    <section >
  <div className="container py-5">
    <div className="row d-flex align-items-center justify-content-center">

      <div className="col-md-7 col-lg-5 col-xl-5 mt-5 offset-xl-1">
        <div className="mb-4">
              <h3>Employee Login</h3>
          </div>
        <form method='POST' onSubmit={handleLoginSubmit}>
      
          <div className=" mb-4">
            <input type="email" name='email' id="form1Example13" className="form-control form-control-lg" />
            <label className="form-label" htmlFor="form1Example13">Email address</label>
          </div>

          <div className=" mb-4">
            <input type="password" name='password' id="form1Example23" className="form-control form-control-lg" />
            <label className="form-label" htmlFor="form1Example23">Password</label>
          </div>

          <div className="d-flex justify-content-around  align-items-center mb-4">  
            <Link to='/register'>New Employee? Register Here</Link>
          </div>

          <button type="submit" className="btn btn-black btn-lg btn-block">Sign in</button>

          <ul className='text-danger'>
             {formError['detail'] && <li>
             {formError['detail']}
              </li>}
            </ul>
          
        </form>
      </div>
    </div>
  </div>
</section>
  )
}

export default UserLogin