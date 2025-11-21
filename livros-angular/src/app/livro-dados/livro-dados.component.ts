import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Editora } from '../model/editora';
import { Livro } from '../model/livro';
import { ControleEditorasService } from '../contole/controle-editoras.service';
import { ControleLivrosService } from '../contole/controle-livros.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-livro-dados',
  templateUrl: './livro-dados.component.html',
  styleUrls: ['./livro-dados.component.css']
})

export class LivroDadosComponent implements OnInit, OnDestroy {
  router: Router;
  livro: Livro = new Livro();
  autoresForm: string = "";
  editoras: Array<Editora>;
  private routeSub: Subscription | undefined;

  constructor(router: Router,
    private servEditora: ControleEditorasService,
    private servLivros: ControleLivrosService,
    private route: ActivatedRoute) {
    this.router = router;
    this.editoras = [];
  }

  ngOnInit(): void {
    this.servEditora.getEditoras().subscribe(data => {
      this.editoras = data;
    });

    const snapshotCodigo = this.route.snapshot.paramMap.get('codigo');
    if (snapshotCodigo) {
      this.servLivros.getLivroById(snapshotCodigo).subscribe(livro => {
        if (livro) {
          this.livro = livro;
          this.autoresForm = (livro.autores || []).join('\n');
        }
      });
    }

    this.routeSub = this.route.params.subscribe(params => {
      const codigo = params['codigo'];
      if (codigo) {
        this.servLivros.getLivroById(codigo).subscribe(livro => {
          if (livro) {
            this.livro = livro;
            this.autoresForm = (livro.autores || []).join('\n');
          }
        });
      }
    });
  }

  incluir = (livro: Livro): void => {
    livro.autores = this.autoresForm.split('\n');
    const inclusao$: Observable<boolean> = this.servLivros.incluir(livro);
    inclusao$.subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigateByUrl("/livroLista");
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

  salvar = (livro: Livro): void => {
    livro.autores = this.autoresForm.split('\n');
    if (livro && livro.codigo) {
      this.servLivros.alterar(livro).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.router.navigateByUrl('/livroLista');
          } else {
            console.log('Alteração falhou (retornou falso).');
          }
        },
        error: err => console.error('Erro ao alterar livro:', err)
      });
    } else {
      this.incluir(livro);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
