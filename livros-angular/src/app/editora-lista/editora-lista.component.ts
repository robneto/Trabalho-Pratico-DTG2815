import { Component, OnInit } from '@angular/core';
import { Editora } from '../model/editora';
import { ControleEditorasService } from '../contole/controle-editoras.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livro-lista',
  templateUrl: './editora-lista.component.html',
  styleUrls: ['./editora-lista.component.css']
})

export class EditoraListaComponent implements OnInit {
  editoras: Array<Editora> = [];
  private editorasSubscription: Subscription | undefined;

  constructor(private servEditora: ControleEditorasService) { }

  ngOnInit(): void {
    this.carregarEditoras();
  }

  carregarEditoras(): void {
    if (this.editorasSubscription) {
      this.editorasSubscription.unsubscribe();
    }
    this.editorasSubscription = this.servEditora.getEditoras()
      .subscribe((editoras: Editora[]) => {
        this.editoras = editoras;
      });
  }

  excluir = (codigo: string): void => {
    this.servEditora.excluir(codigo).subscribe(() => {
      this.carregarEditoras();
    });
  }

  ngOnDestroy(): void {
    if (this.editorasSubscription) {
      this.editorasSubscription.unsubscribe();
    }
  }
}

