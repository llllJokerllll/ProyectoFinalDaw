import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';
import { Inscripcion } from '../models/inscripcion';
import { Precio } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent implements OnInit {
  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precios: Precio[] = new Array<Precio>();
  precioSeleccionado: Precio = new Precio();
  idPrecio: string = 'null';
  constructor(private db: AngularFirestore, private msj: MensajesService) {}

  ngOnInit(): void {
    this.db
      .collection('precios')
      .get()
      .subscribe((resultado) => {
        resultado.docs.forEach((item) => {
          let precio = item.data() as Precio;
          precio.id = item.id;
          precio.ref = item.ref;
          this.precios.push(precio);
        });
      });
  }

  asignarCliente(cliente: Cliente) {
    this.inscripcion.cliente = cliente.ref;
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente() {
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar() {
    if (this.inscripcion.validar().esValido) {
      let inscripcionAgregar = {
        fecha: this.inscripcion.fecha,
        fechaFinal: this.inscripcion.fechaFinal,
        cliente: this.inscripcion.cliente,
        precios: this.inscripcion.precios,
        subTotal: this.inscripcion.subTotal,
        iva: this.inscripcion.iva,
        total: this.inscripcion.total,
      };
      this.db
        .collection('inscripciones')
        .add(inscripcionAgregar)
        .then((resultado) => {
          this.inscripcion = new Inscripcion();
          this.clienteSeleccionado = new Cliente();
          this.precioSeleccionado = new Precio();
          this.idPrecio = 'null';
          this.msj.mensajeCorrecto(
            'Inscripción',
            'Se ha guardado correctamente'
          );
        });
    } else {
      this.msj.mensajeAdvertencia(
        'Advertencia',
        this.inscripcion.validar().mensaje
      );
    }
  }

  seleccionarPrecio(id: string) {
    this.precioSeleccionado = this.precios.find((x) => x.id == id);
    this.inscripcion.precios = this.precioSeleccionado.ref;

    this.inscripcion.subTotal = this.precioSeleccionado.coste;
    this.inscripcion.iva = this.inscripcion.subTotal * 0.21;
    this.inscripcion.total = this.inscripcion.subTotal + this.inscripcion.iva;

    this.inscripcion.fecha = new Date();

    if (this.precioSeleccionado.tipoDuracion == 1) {
      let fechaFinal = new Date(
        this.inscripcion.fecha.getFullYear(),
        this.inscripcion.fecha.getMonth(),
        this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion
      );
      this.inscripcion.fechaFinal = fechaFinal;
    }
    if (this.precioSeleccionado.tipoDuracion == 2) {
      let fechaFinal = new Date(
        this.inscripcion.fecha.getFullYear(),
        this.inscripcion.fecha.getMonth(),
        this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion
      );
      this.inscripcion.fechaFinal = fechaFinal;
    }
    if (this.precioSeleccionado.tipoDuracion == 3) {
      let fechaFinal = new Date(
        this.inscripcion.fecha.getFullYear(),
        this.inscripcion.fecha.getMonth(),
        this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion
      );
      this.inscripcion.fechaFinal = fechaFinal;
    }
    if (this.precioSeleccionado.tipoDuracion == 4) {
      let fechaFinal = new Date(
        this.inscripcion.fecha.getFullYear(),
        this.inscripcion.fecha.getMonth(),
        this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion
      );
      this.inscripcion.fechaFinal = fechaFinal;
    }
    if (this.precioSeleccionado.tipoDuracion == 5) {
      let fechaFinal = new Date(
        this.inscripcion.fecha.getFullYear(),
        this.inscripcion.fecha.getMonth(),
        this.inscripcion.fecha.getDate() + this.precioSeleccionado.duracion
      );
      this.inscripcion.fechaFinal = fechaFinal;
    }
  }
}
