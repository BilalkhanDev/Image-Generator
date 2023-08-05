
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/auth/Login';
// import Home from './page/Home';
// import Nav from './components/Nav';
// import CreatePost from './page/CreatePost'
// import Collection from './components/Collection';
// import Signup from './components/auth/SignUp'
// const App = () => {
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setAuthenticated(true);
//     }
//   }, []);

//   return (
//     <Router>
//        {authenticated && <Nav setAuthenticated={setAuthenticated}/>}
//       <Routes>
//         <Route
//           path="/"
//           element={authenticated ? <Navigate to="/" /> : <Login setAuthenticated={setAuthenticated} />}
//         />
//          <Route
//           path="/signup"
//           element={authenticated ? <Navigate to="/" /> : <Signup setAuthenticated={setAuthenticated} />}
//         />
//       {authenticated ?
//       <>
//        <Route path="/home" element={ <Home /> } />
//         <Route path="/create" element= {<CreatePost />}/>
//         <Route path="/mycollection" element={ <Collection />}/>
//       </> :
//        <Route path="*" element={<Navigate to="/" />} />
//      }
       
//       </Routes>
//     </Router>
//   );
// };

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Home from './page/Home';
import Nav from './components/Nav';
import CreatePost from './page/CreatePost';
import Collection from './components/Collection';
import Signup from './components/auth/SignUp';
import backgroundImage from './assets/backgroundImage.jpg'; // Adjust the path if necessary

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: '100vh', // Set the minimum height to fill the viewport
        }}
      >
        {authenticated && <Nav setAuthenticated={setAuthenticated} />}
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setAuthenticated={setAuthenticated} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              authenticated ? (
                <Navigate to="/" />
              ) : (
                <Signup setAuthenticated={setAuthenticated} />
              )
            }
          />
          {authenticated ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/mycollection" element={<Collection />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

