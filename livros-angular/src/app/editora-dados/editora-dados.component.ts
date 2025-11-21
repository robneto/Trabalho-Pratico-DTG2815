import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Editora } from '../model/editora';
import { ControleEditorasService } from '../contole/controle-editoras.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livro-dados',
  templateUrl: './editora-dados.component.html',
  styleUrls: ['./editora-dados.component.css']
})

export class EditoraDadosComponent implements OnInit, OnDestroy {
  router: Router;
  editora: Editora = new Editora();
  autoresForm: string = "";
  editoras: Array<Editora>;
  private routeSub: Subscription | undefined;

  constructor(router: Router,
    private servEditora: ControleEditorasService,
    private route: ActivatedRoute) {
    this.router = router;
    this.editoras = [];
  }

  ngOnInit(): void {
    const snapshotCodigo = this.route.snapshot.paramMap.get('codigo');
    if (snapshotCodigo) {
      this.servEditora.getEditoraById(snapshotCodigo).subscribe(editora => {
        if (editora) {
          this.editora = editora;
        }
      });
    }

    this.routeSub = this.route.params.subscribe(params => {
      const codigo = params['codigo'];
      if (codigo) {
        this.servEditora.getEditoraById(codigo).subscribe(editora => {
          if (editora) {
            this.editora = editora;
          }
        });
      }
    });
  }

  incluir = (editora: Editora): void => {
    const inclusao$: Observable<boolean> = this.servEditora.incluir(editora);
    inclusao$.subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigateByUrl("/editoraLista");
        } else {
          console.log("Inclusão falhou (retornou falso).");
        }
      },
      error: (err) => {
        console.error("Erro durante a inclusão:", err);
      },
      complete: () => {
        console.log("Inclusão completa.");
      }
    });
  }

  salvar = (editora: Editora): void => {
    if (editora && editora.codigo) {
      // editar
      this.servEditora.alterar(editora).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.router.navigateByUrl('/editoraLista');
          } else {
            console.log('Alteração falhou (retornou falso).');
          }
        },
        error: err => console.error('Erro ao alterar editora:', err)
      });
    } else {
      this.incluir(editora);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
