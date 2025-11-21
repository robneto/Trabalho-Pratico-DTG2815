import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface BreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadCrumb[] = [];
  private routerSub: Subscription | undefined;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.route.root);
    });

    this.breadcrumbs = this.buildBreadCrumb(this.route.root);
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL) {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'] || (routeURL ? routeURL : '');
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadCrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
