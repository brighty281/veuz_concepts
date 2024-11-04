import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import userimg from "../../images/user.png";

function AdminUpdateUser() {

const baseURL = "http://127.0.0.1:8000";
const { id } = useParams();
const [formError, setFormError] = useState([]);
const [userData, setUserData] = useState({
    first_name: '',
    phone_number: '',
    email: '',
    salary:'',
    designation:'',
    qualification:'',
    experience:'',
    is_active:true,
    User_Profile: {},
  });

useEffect(() => {
    axios.get(baseURL+`/api/accounts/admin/users/${id}/`)
      .then(response => {
        setUserData(response.data); 
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        navigate('/admincontrol')
      });
  }, [id]); 
  
  
  const handleInputChange = (event) => {
    const { name, value, type, checked,files } = event.target;
  
    setUserData((prevData) => {
      if (type === 'checkbox') {
        return {
          ...prevData,
          [name]: checked,
        };
      }
      if(type==='file') {
        return {
          ...prevData,
          User_Profile: { ...prevData.User_Profile, profile_pic: files[0] },
        }
      }
  
  
      if (["designation", "salary", "experience", "qualification"].includes(name)) {
        return {
          ...prevData,
          User_Profile: {
            ...prevData.User_Profile,
            [name]: value,
          },
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  


  const handleDelete = () => {
      axios.delete(baseURL+`/api/accounts/admin/users/delete/${id}/`)
        .then(response => {
          
          navigate('/admincontrol')
         
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
  };

  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('phone_number', userData.phone_number);
    formData.append('email', userData.email);
    formData.append('is_active', userData.is_active);

   
    formData.append('User_Profile.designation', userData.User_Profile.designation || '');
    formData.append('User_Profile.salary', userData.User_Profile.salary || '');
    formData.append('User_Profile.experience', userData.User_Profile.experience || '');
    formData.append('User_Profile.qualification', userData.User_Profile.qualification || '');

    if (userData.User_Profile.profile_pic) {
      formData.append('profile_pic', userData.User_Profile.profile_pic);
    }

    axios.put(baseURL+`/api/accounts/admin/users/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(response => {
        navigate('/admincontrol')
  
      })
      .catch(error => {
        setFormError(error.response.data);
       
        console.error('Error updating user:', error);
      });
  };

  return (
    <section  style={{backgroundColor: "#000000"}}>
    <div className="container py-5 ">
      <div className="row d-flex justify-content-center align-items-center ">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-2-strong" style={{borderRadius: '1rem'}}>
            <div className="card-body p-5">
            <img
                      src={
                        userData.User_Profile
                          ? userData.User_Profile.profile_pic
                          : userimg
                      }
                      className="rounded-circle"
                      alt=""
                      style={{ width: "80px", height: "80px" }}
                    />
              <h3 className="mb-5 text-center">Update {userData.first_name}</h3>
              <form onSubmit={handleSubmit} method='POST'>

              <div className=" mb-4">
                <input type="text" name='first_name'  value={userData.first_name} className="form-control form-control-lg" required onChange={handleInputChange}/>
                <label className="form-label" >Name</label>
              </div>
              <div className=" mb-4">
                <input type="email" id="typeEmailX-2" name='email' value={userData.email} className="form-control form-control-lg"  required onChange={handleInputChange}/>
                <label className="form-label" htmlFor="typeEmailX-2">Email</label>
              </div>

              <div className=" mb-4">
                <input type="text"  className="form-control form-control-lg" value={userData.phone_number}  name='phone_number' required onChange={handleInputChange}/>
                <label className="form-label" >Mobile Number</label>
              </div>

              
              <div className=" mb-4">
                <input type="text"  className="form-control form-control-lg" value={userData.User_Profile?.designation}  name='designation' required onChange={handleInputChange}/>
                <label className="form-label" >Designation</label>
              </div>

              <div className=" mb-4">
                <input type="text"  className="form-control form-control-lg" value={userData.User_Profile?.salary}  name='salary' required onChange={handleInputChange}/>
                <label className="form-label">Salary</label>
              </div>

              <div className=" mb-4">
                <input type="text"  className="form-control form-control-lg" value={userData.User_Profile?.experience}  name='experience' required onChange={handleInputChange}/>
                <label className="form-label" >Experience</label>
              </div>
              
              <div className=" mb-4">
                <input type="text"  className="form-control form-control-lg" value={userData.User_Profile?.qualification}  name='qualification' required onChange={handleInputChange}/>
                <label className="form-label" >Qualification</label>
              </div>


           <div className=" mb-4">
              <input type="checkbox" name="is_active" checked={userData.is_active} onChange={handleInputChange} />
                <label className="form-label" htmlFor="typePasswordX-2">Active Status</label>
              </div>

              <div className=" mb-4">
                <input type="file"  className="form-control form-control-lg" name='profile_pic'  onChange={handleInputChange}  />
                <label className="form-label" htmlFor="typePasswordX-2">Profile Picture</label>
              </div>
  

              <button className="btn btn-black btn-lg btn-block" type="submit">Update Now</button>
              </form>
              <button className="btn btn-danger btn-lg btn-block my-2" type="button" onClick={handleDelete}>Delete This User</button>

           
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default AdminUpdateUser