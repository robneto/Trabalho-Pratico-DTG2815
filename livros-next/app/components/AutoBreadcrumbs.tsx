"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SEGMENT_LABELS: Record<string, string> = {
  'pages': '',
  'LivroLista': 'Livros',
  'EditoraLista': 'Editoras',
};

function humanize(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];

  const s = decodeURIComponent(segment).replace(/[-_]/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AutoBreadcrumbs() {
  const pathname = usePathname() || '/';
  const rawSegments = pathname.split('/').filter(Boolean);

  const segments = rawSegments[0] === 'pages' ? rawSegments.slice(1) : rawSegments;

  const crumbs = [{ label: 'Início', href: '/' }];

  let acc = '';
  segments.forEach((seg) => {
    acc += `/${seg}`;
    crumbs.push({ label: humanize(seg), href: acc });
  });

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li
              key={i}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {!isLast && c.href ? (
                <Link href={c.href} className="text-decoration-none">
                  {c.label}
                </Link>
              ) : (
                c.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
