import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LivroListaComponent } from './livro-lista/livro-lista.component';
import { LivroDadosComponent } from './livro-dados/livro-dados.component';
import { EditoraListaComponent } from './editora-lista/editora-lista.component';
import { EditoraDadosComponent } from './editora-dados/editora-dados.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Início' } },
  { path: 'livroLista', component: LivroListaComponent, data: { breadcrumb: 'Livros' } },
  { path: 'livroDados', component: LivroDadosComponent, data: { breadcrumb: 'Dados do Livro' } },
  { path: 'livroDados/:codigo', component: LivroDadosComponent, data: { breadcrumb: 'Dados do Livro' } },
  { path: 'editoraLista', component: EditoraListaComponent, data: { breadcrumb: 'Editoras' } },
  { path: 'editoraDados', component: EditoraDadosComponent, data: { breadcrumb: 'Dados da Editora' } },
  { path: 'editoraDados/:codigo', component: EditoraDadosComponent, data: { breadcrumb: 'Dados da Editora' } }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
