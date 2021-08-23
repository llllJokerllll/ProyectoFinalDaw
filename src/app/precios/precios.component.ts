import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Precio } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss'],
})
export class PreciosComponent implements OnInit {
  formularioPrecio: FormGroup;
  precios: Precio[] = new Array<Precio>();
  precio: Precio;
  esEditable: boolean = false;
  id: string;
  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private msj: MensajesService
  ) {}

  ngOnInit(): void {
    this.formularioPrecio = this.fb.group({
      nombre: ['', Validators.required],
      coste: ['', Validators.required],
      duracion: ['', Validators.required],
      tipoDuracion: ['', Validators.required],
    });

    this.mostrarPrecios();
  }

  mostrarPrecios() {
    this.db
      .collection('precios')
      .get()
      .subscribe((resultado) => {
        this.precios.length = 0;
        resultado.docs.forEach((dato) => {
          this.precio = dato.data() as Precio;
          this.precio.id = dato.id;
          this.precio.ref = dato.ref;
          this.precios.push(this.precio);
        });
      });
  }

  agregar() {
    this.db
      .collection<Precio>('precios')
      .add(this.formularioPrecio.value)
      .then(() => {
        this.msj.mensajeCorrecto('Agregado', 'Se añadió correctamente');
        this.formularioPrecio.reset();
        this.mostrarPrecios();
      })
      .catch(() => {
        this.msj.mensajeError('Error', 'Ocurrio un error al añadir el precio');
      });
  }

  editarPrecio(precio: Precio) {
    this.esEditable = true;
    this.formularioPrecio.setValue({
      nombre: precio.nombre,
      coste: precio.coste,
      duracion: precio.duracion,
      tipoDuracion: precio.tipoDuracion,
    });
    this.id = precio.id;
  }

  editar() {
    this.db
      .doc('precios/' + this.id)
      .update(this.formularioPrecio.value)
      .then(() => {
        this.msj.mensajeCorrecto('Editado', 'Se editó correctamente');
        this.formularioPrecio.reset();
        this.esEditable = false;
        this.mostrarPrecios();
      })
      .catch(() => {
        this.msj.mensajeError('Error', 'Ocurrio un error al editar el precio');
      });
  }
}
