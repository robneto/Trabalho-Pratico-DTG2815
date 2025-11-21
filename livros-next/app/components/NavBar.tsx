"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname() || '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="app-navbar">
      <nav className="navbar navbar-expand-lg navbar-dark container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
            <rect width="24" height="24" rx="4" fill="#fff" opacity="0.12" />
            <path d="M6 7h12v2H6zM6 11h12v2H6zM6 15h9v2H6z" fill="#fff" />
          </svg>
          <strong>Catálogo</strong>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link href="/pages/LivroLista" className={`nav-link nav-pill ${isActive('/pages/LivroLista') ? 'active-pill' : ''}`}>
                Listar Livros
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/pages/EditoraLista" className={`nav-link nav-pill ${isActive('/pages/EditoraLista') ? 'active-pill' : ''}`}>
                Listar Editoras
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
