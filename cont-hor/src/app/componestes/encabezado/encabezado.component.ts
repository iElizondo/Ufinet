import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"; 

import { FirebaseService } from '../../servicio/firebase.service';
import { Usuario } from '../../model/usuario'
@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  usuario: Usuario={
    nombre:'',
    email:'',
    urlFoto:''
  }
  constructor(public _fireService: FirebaseService, private _router:Router) {
    this._fireService.logueado().subscribe(user=>{
      if(user){
        this.usuario.nombre = user.displayName;
        this.usuario.email = user.email;
        this.usuario.urlFoto = user.photoURL;
      }else{
        console.log("No esta logueado");
        this._router.navigate(['#']);
      }
    });   
   }
    
  ngOnInit() {
    
  }

  salir(){
    this._fireService.logoutUsuario();
  }
}
