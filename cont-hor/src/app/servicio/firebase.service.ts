//Import Generales
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
//Import Autenticacion
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
//Import Datos
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Info } from '../model/info';
import { Usuario } from '../model/usuario';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public nombreUsuario: String;
  public emailUsuario:  String;
  public urlFoto: String;
  
  constructor(private afsAuth: AngularFireAuth, private angularFirestore: AngularFirestore) { 
    this.infoColletion = angularFirestore.collection<Info>('info');
    this.infos = this.infoColletion.valueChanges();
  }

  private infoColletion: AngularFirestoreCollection<Info>;
  private infos: Observable<Info[]>;
  private infoDoc: AngularFirestoreDocument<Info>;
  private info: Observable<Info>;

  
  public actual: Usuario ={}

  private tabla: string = 'info';
  private campo: string = 'fecha';

  loginGoogleUsuario(){
    return this.afsAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginGitHubUsuario(){
    return this.afsAuth.auth.signInWithPopup(new auth.GithubAuthProvider());
  }

  logueado(){
    return this.afsAuth.authState.pipe(map(auth=>auth));
  }

  logoutUsuario() {
    return this.afsAuth.auth.signOut();
   }

   agregarInfo(info: Info): void{
    this.infoColletion.add(info);
   }

   modificarInfo(info: Info): void {
    let id = info.id;
    this.infoDoc = this.angularFirestore.doc<Info>(`info/${id}`);
    this.infoDoc.update(info);
  }

  buscarInfos(){
    return this.infos = this.infoColletion.snapshotChanges().pipe(map(changes=>{
      return changes.map( action=>{
        const data = action.payload.doc.data() as Info;
        data.id = action.payload.doc.id;
        return data;
      });
    }));
  }

  // buscarinfo(idinfo:string){
  //   this.infoDoc = this.angularFirestore.doc<Info>(`infos/${idinfo}`);
  //   return this.info = this.infoDoc.snapshotChanges().pipe(map (action =>{
  //     if(action.payload.exists == false){
  //       return null;
  //     }else{
  //       const data = action.payload.data() as Info;
  //       data.id = action.payload.id;
  //       return data;
  //     }
  //   }));
  // }
}
