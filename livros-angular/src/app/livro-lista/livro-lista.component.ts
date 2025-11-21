import { Component, OnInit } from '@angular/core';
import { Editora } from '../model/editora';
import { Livro } from '../model/livro';
import { ControleEditorasService } from '../contole/controle-editoras.service';
import { ControleLivrosService } from '../contole/controle-livros.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-livro-lista',
  templateUrl: './livro-lista.component.html',
  styleUrls: ['./livro-lista.component.css']
})

export class LivroListaComponent implements OnInit {
  editoras: Array<Editora> = [];
  livros: Array<Livro> = [];
  private editorasSubscription: Subscription | undefined;
  private livrosSubscription: Subscription | undefined;

  constructor(private servEditoras: ControleEditorasService,
    private servLivros: ControleLivrosService) { }

  ngOnInit(): void {
    this.carregarEditoras();
    this.carregarLivros();
  }

  carregarEditoras(): void {
    if (this.editorasSubscription) {
      this.editorasSubscription.unsubscribe();
    }
    this.editorasSubscription = this.servEditoras.getEditoras()
      .subscribe((editoras: Editora[]) => {
        this.editoras = editoras;
      });
  }
  carregarLivros(): void {
    if (this.livrosSubscription) {
      this.livrosSubscription.unsubscribe();
    }
    this.livrosSubscription = this.servLivros.obterLivros()
      .subscribe((livros: Livro[]) => {
        this.livros = livros;
      });
  }

  excluir = (codigo: string): void => {
    this.servLivros.excluir(codigo).subscribe(() => {
      this.carregarLivros();
    });
  }

  getNomeEditora(codEditora: number): string {
    const editoraEncontrada = this.editoras
      .find(e => e.codEditora == codEditora);
    return editoraEncontrada ? editoraEncontrada.nome : 'Desconhecida';
  }

  ngOnDestroy(): void {
    if (this.livrosSubscription) {
      this.livrosSubscription.unsubscribe();
    }
  }
}

