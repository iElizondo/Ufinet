import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

import { FirebaseService } from '../../servicio/firebase.service';
import { Info } from '../../model/info';
import { Usuario } from '../../model/usuario';
import { from, empty } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public infoFiltrada = [];
  private filtro = '';
  public info: Info = {
    usuario:'',
    fecha:'',
    hora_ini:'',
    hora_fin:'',
    id:''
  }
  public actual: Usuario ={
    nombre:''
  }

  constructor(private _fbService: FirebaseService, private datePipe: DatePipe) { 
    this.usuario_actual();
  }

  iniciar(filtro){
    this._fbService.buscarInfos().subscribe(datos=>{
      this.infoFiltrada = []
      datos.forEach(dato => {
        if(dato.fecha == filtro){
          this.infoFiltrada.push(dato);
        }
      });
    });
  }
  
  iniciar_jornada(dato:Info){
    var h = new Date();
    dato.hora_ini = this.datePipe.transform(h, 'hh:mm a');
    dato.estado = 'i';
    this._fbService.modificarInfo(dato);
  }

  finalizar_jornada(dato:Info){
    var h = new Date();
    dato.hora_fin = this.datePipe.transform(h, 'hh:mm a');
    dato.estado = 'f';
    this._fbService.modificarInfo(dato);
  }
  ngOnInit() {
      var f = new Date();
      this.filtro = this.datePipe.transform(f, 'dd/MM/yyyy');
      this.iniciar(this.filtro);    
      
  }
  
  usuario_actual(){
    this._fbService.logueado().subscribe(usu=>{
      if(usu){
        this.actual.email = usu.email;
      }
      
    })
  }
}
