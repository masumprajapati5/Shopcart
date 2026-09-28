import React, { useContext } from 'react'
import {Outlet,Navigate} from "react-router"
import { AuthContext } from '../context/AuthContext'

const AuthLayout = () => {

  const {user,loading}= useContext(AuthContext)
  if(loading){
    return <p>Loading...</p>
  }

  if(user){
    return <Navigate to="/main" />
  }


  return <Outlet/>
}

export default AuthLayout