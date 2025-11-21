import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditoraListaComponent } from './editora-lista/editora-lista.component';
import { EditoraDadosComponent } from './editora-dados/editora-dados.component';
import { LivroListaComponent } from './livro-lista/livro-lista.component';
import { LivroDadosComponent } from './livro-dados/livro-dados.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

import { ControleEditorasService } from './contole/controle-editoras.service';
import { ControleLivrosService } from './contole/controle-livros.service';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    EditoraListaComponent,
    EditoraDadosComponent,
    LivroListaComponent,
    LivroDadosComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ControleEditorasService, ControleLivrosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
