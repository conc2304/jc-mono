import { Route, Routes, Link, BrowserRouter } from 'react-router-dom';

import { ConnectFour } from '../components/connect-four';
export function App() {
  return (
    <div>
      <h1>
        <span> Hello there, </span>
        Welcome games 👋
      </h1>
      <ConnectFour />
    </div>
  );
}

export default App;
