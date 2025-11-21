"use client";

import React from "react";
import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  crumbs: Crumb[];
};

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        {crumbs.map((c, i) => (
          <li
            key={i}
            className={`breadcrumb-item ${i === crumbs.length - 1 ? "active" : ""}`}
            aria-current={i === crumbs.length - 1 ? "page" : undefined}
          >
            {c.href && i !== crumbs.length - 1 ? (
              <Link href={c.href} className="text-decoration-none">
                {c.label}
              </Link>
            ) : (
              c.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
