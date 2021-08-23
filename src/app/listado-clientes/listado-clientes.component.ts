import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})

export class ListadoClientesComponent implements OnInit {
  clientes: any[] = new Array<any>();
  cliente: any;
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {

    // this.db.collection('clientes').valueChanges().subscribe((resultado)=>{
    //   this.clientes = resultado;
    // })

    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((resultado)=>{

      /** Aquí leemos los datos de la base de datos, creamos un cliente y le asignamos su id y su referencia, y hacemos push*/
      resultado.docs.forEach((item)=>{
        this.cliente = item.data();
        this.cliente.id = item.id;
        this.cliente.ref = item.ref;

        this.clientes.push(this.cliente);
      })
    })
  }

}
