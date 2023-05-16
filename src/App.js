import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Main from './pages/main/main';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/main' element={<Main/>} />
          {/* <Route path='/createpost' element={ <CreatePost/>} />
          <Route path='/updatepost' element={ <UpdatePost/>} /> */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
