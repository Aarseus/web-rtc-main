import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Room from './pages/Room';
const MyRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/room/:roomId' element={<Room/>}/>

    </Routes>
      
    </BrowserRouter>
  )
}

export default MyRoutes
