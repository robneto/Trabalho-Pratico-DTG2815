import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Editora } from '../model/editora';
import { EditoraMongo, baseURL } from '../model/editora-mongo';

@Injectable({
  providedIn: 'root'
})

export class ControleEditorasService {

  constructor(private http: HttpClient) { }

  getEditoras(): Observable<Editora[]> {

    return this.http.get<EditoraMongo[]>(baseURL).pipe(
      map(data => {
        return data.map(item => ({
          codigo: item._id as string,
          codEditora: item.codEditora,
          nome: item.nome
        }));
      }),
      catchError(error => {
        console.error("Erro ao buscar editoras:", error);
        return of([]);
      })
    );
  }

  getNomeEditora(codEditora: number): Observable<string> {
    return this.getEditoras().pipe(
      map(editoras => {
        const editoraEncontrada = editoras.find(e => e.codEditora === codEditora);
        return editoraEncontrada ? editoraEncontrada.nome : "Desconhecida";
      }),
      catchError(error => {
        console.error("Erro ao buscar nome da editora:", error);
        return of("Desconhecida");
      })
    );
  }

  excluir(codigo: string): Observable<boolean> {
    return this.http.delete(`${baseURL}/${codigo}`).pipe(
      map(() => true),
      catchError(error => {
        console.error("Erro ao excluir editora:", error);
        return of(false);
      })
    );
  }

  incluir(editora: Editora): Observable<boolean> {
    const livroMongo: EditoraMongo = {
      _id: null,
      codEditora: editora.codEditora,
      nome: editora.nome
    };

    return this.http.post(baseURL, livroMongo).pipe(
      map(() => true),
      catchError(error => {
        console.error("Erro ao incluir editora:", error);
        return of(false);
      })
    );
  }

  getEditoraById(codigo: string): Observable<Editora | null> {
    return this.http.get<EditoraMongo>(`${baseURL}/${codigo}`).pipe(
      map(item => ({
        codigo: item._id as string,
        codEditora: item.codEditora,
        nome: item.nome
      } as Editora)),
      catchError(error => {
        console.error("Erro ao buscar editora:", error);
        return of(null);
      })
    );
  }

  alterar(editora: Editora): Observable<boolean> {
    const payload: EditoraMongo = {
      codEditora: editora.codEditora,
      nome: editora.nome
    } as any;
    return this.http.put(`${baseURL}/${editora.codigo}`, payload).pipe(
      map(() => true),
      catchError(error => {
        console.error("Erro ao alterar editora:", error);
        return of(false);
      })
    );
  }

}
