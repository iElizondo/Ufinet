import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

import { FirebaseService } from '../../servicio/firebase.service';
import { Info } from '../../model/info';
import { from, empty } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public infoFiltrada=[];
  private filtro='';
  private llave = 0;
  public info: Info = {
    usuario:'',
    fecha:'',
    hora_ini:'',
    hora_fin:'',
    id:''
  }

  constructor(private _fbService: FirebaseService, private datePipe: DatePipe) { }

  iniciar(filtro){
    this.infoFiltrada = [];
    this._fbService.buscarInfos().subscribe(datos=>{
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
    dato.estado = 'l';
    this._fbService.modificarInfo(dato);
  }
  ngOnInit() {
    if(this.llave==0){
      var f = new Date();
      this.filtro = this.datePipe.transform(f, 'dd/MM/yyyy');
      this.iniciar(this.filtro);
      this.llave++;
    }
  }

}
