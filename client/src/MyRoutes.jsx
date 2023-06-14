import { BrowserRouter, Route, Routes } from 'react-router-dom'

// import Room from './pages/Room';
// import Latest from './pages/Latest';
// import Homepage from './pages/Homepage';
// import Try from './pages/Try';
// import Feed from './pages/Feed';
import New from './pages/New';
// import HomeSecurity from './pages/HomeSecurity';

const MyRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        {/* <Route path='/' element={<Homepage/>}/> */}
        {/* <Route path='/room' element={<Room/>}/>
        <Route path='/show' element={<Latest/>}/>
        <Route path='/try' element={<Try/>}/>
        <Route path='/feed' element={<Feed/>}/> */}
        <Route path='/new' element={<New/>}/>
        {/* <Route path='/' element={<HomeSecurity/>}/> */}
    </Routes>
      
    </BrowserRouter>
  )
}

export default MyRoutes