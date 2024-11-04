import axios from "axios";
import React, { useEffect, useState } from "react";
import userimg from "../../images/user.png";
import { Link } from "react-router-dom";

function AdminHome() {
  const baseURL = "http://127.0.0.1:8000";
  const [users, setUsers] = useState([]);

  const fetchUsers = (url) => {
    axios
      .get(url)
      .then((response) => {
        setUsers(response.data.results);
        console.log(response.data.results)
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers(baseURL + "/api/accounts/admin/users/");
  }, []);



  return (
    <>
      <div className="container">
        <h4 className="my-4 mx-2 ">Employees List</h4>
        
        <Link className="btn btn-dark my-3" to='user/create'>Add Employee</Link>
        <table className="table align-middle mb-0 bg-white table-responsive">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Qualification</th>
              <th>Active Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users == "" && <tr><td>No Users Found Your Match</td></tr>}
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        user.User_Profile
                          ? user.User_Profile.profile_pic
                          : userimg
                      }
                      className="rounded-circle"
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{user.first_name}</p>
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="badge badge-primary rounded-pill d-inline">
                    {user.phone_number}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary rounded-pill d-inline">
                    {user.User_Profile?.designation || 'NA'}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary rounded-pill d-inline">
                    {user.User_Profile?.qualification || 'NA'}
                  </span>
                </td>
                <td>
                <span className={`badge rounded-pill d-inline ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {user.is_active ? 'Active' : 'Not Active'}
                </span>
                </td>

                <td>
                  <Link
                    type="button"
                    className="btn btn-link btn-rounded btn-sm fw-bold"
                    to={`user/update/${user.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    
      </div>
    </>
  );
}

export default AdminHome;
