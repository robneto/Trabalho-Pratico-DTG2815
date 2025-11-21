import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EditoraLista from './EditoraLista';
import EditoraDados from './EditoraDados';
import EditoraEdita from './EditoraEdita';
import LivroLista from './LivroLista';
import LivroDados from './LivroDados';
import LivroEdita from './LivroEdita';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return null;
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Home</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/livroLista">Lista de Livros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/editoraLista">Lista de Editoras</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/livroLista" element={<LivroLista />} />
        <Route path="/livroDados" element={<LivroDados />} />
        <Route path="/livroEdita/:id" element={<LivroEdita />} />
        <Route path="/editoraLista" element={<EditoraLista />} />
        <Route path="/editoraDados" element={<EditoraDados />} />
        <Route path="/editoraEdita/:id" element={<EditoraEdita />} />
      </Routes>
    </Router>
  );
}

export default App;