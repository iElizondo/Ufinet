import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { DatePipe } from "@angular/common";

import { FirebaseService } from '../../servicio/firebase.service';
import { Router } from "@angular/router"; 
import { from, empty } from 'rxjs';

import { Info } from '../../model/info'
import { format } from 'url';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  info: Info = {
    usuario:'',
    fecha:'',
    hora_ini:'',
    hora_fin:'',
    estado:'',
    id:''
  }
  public infos=[];

  constructor(private _fbService: FirebaseService,
    private _router:Router, public afAuth: AngularFireAuth, 
    private datePipe: DatePipe) { }

  ngOnInit() {
  }
  
  ingresarGoogle(){
    this._fbService.loginGoogleUsuario().then((res)=>{
      this.regitrarInfo(res);
      this.LoginRedirecion();
    }).catch(err=>this.ErrorLogin(err));
  }

  ingresarGitHub(){
    this._fbService.loginGitHubUsuario().then((res)=>{
      this.regitrarInfo(res);
      this.LoginRedirecion();
    }).catch(err=>this.ErrorLogin(err));
  }

  LoginRedirecion(): void{
    this._router.navigate(['inicio']);
  }

  ErrorLogin(err:string):void{
    console.log("error",err);
  }

  regitrarInfo(res){
    this.info.usuario = res.user.email;
    var f = new Date();
    this.info.fecha = this.datePipe.transform(f, 'dd/MM/yyyy');
    this.info.estado = 'l';
    this.info.hora_ini = '';
    this.info.hora_fin = '';
    this.info.id = '';
    this.buscar(this.info.fecha);
    if(this.infos.length != 0){
      this._fbService.agregarInfo(this.info);
    }
  }

  buscar(filtro){
    this._fbService.buscarInfos().subscribe(datos=>{
      datos.forEach(dato => {
        if(dato.usuario == this.info.usuario && dato.fecha == filtro){
          this.infos.push(dato);
        }
      });
    })
  }
}
