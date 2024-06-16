import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import Home from './container/Home';
import EmailDataListContainer from './container/EmailDataListContainer';
import AuthCallback from './component/AuthCallback';
import AddAccountContainer from './container/AddAccountContainer';
import Login from './component/Login';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" exact element={<Home/>} />
                        <Route path="/sync" element={<EmailDataListContainer/>} />
                        <Route path="/auth/callback" element={<AuthCallback/>} />
                        <Route path="/add-account" element={<AddAccountContainer/>} />
                        <Route path="/login" element={<Login/>} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
