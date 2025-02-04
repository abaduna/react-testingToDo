import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';

import { Navbar, Nav } from 'react-bootstrap';
import ListView from './pages/ListView';

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Create task</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Create task</Nav.Link>
            <Nav.Link as={Link} to="/lists">Lists tasks</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<ListView />} />
      </Routes>
    </Router>
  );
}

export default App
