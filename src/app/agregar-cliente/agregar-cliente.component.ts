import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss'],
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  porcentajeSubida: number = 0;
  imgUrl: String = '';
  esEditable: boolean = false;
  id: String;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private activeRouter: ActivatedRoute,
    private msj: MensajesService
  ) {}

  ngOnInit(): void {
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgUrl: ['', Validators.required],
    });

    this.id = this.activeRouter.snapshot.params.clienteID;
    if (this.id != undefined) {
      this.esEditable = true;
      this.db
        .doc<any>('clientes/' + this.id)
        .valueChanges()
        .subscribe((cliente) => {
          this.formularioCliente.setValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            email: cliente.email,
            dni: cliente.dni,
            fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000)
              .toISOString()
              .substring(0, 10),
            telefono: cliente.telefono,
            imgUrl: '',
          });
          this.imgUrl = cliente.imgUrl;
        });
    }
  }

  agregar() {
    this.formularioCliente.value.imgUrl = this.imgUrl;
    this.formularioCliente.value.fechaNacimiento = new Date(
      this.formularioCliente.value.fechaNacimiento
    );
    this.db
      .collection('clientes')
      .add(this.formularioCliente.value)
      .then((termino) => {
        this.msj.mensajeCorrecto('Agregar', 'Se creó correctamente');
        this.formularioCliente.reset();
      })
      .catch(() => {
        this.msj.mensajeError('Error', 'Ocurrio un error al crear el cliente');
      });
  }

  editar() {
    this.formularioCliente.value.imgUrl = this.imgUrl;
    this.formularioCliente.value.fechaNacimiento = new Date(
      this.formularioCliente.value.fechaNacimiento
    );

    this.db
      .doc('clientes/' + this.id)
      .update(this.formularioCliente.value)
      .then((termino) => {
        this.msj.mensajeCorrecto('Editar', 'Se editó correctamente');
      })
      .catch(() => {
        this.msj.mensajeError('Error', 'Ocurrio un error al editar el cliente');
      });
  }

  subirImagen(evento: any) {
    if (evento.target.files.length > 0) {
      let fecha = new Date().getTime().toString();
      let archivo = evento.target.files[0];
      let ruta = 'clientes/' + fecha + archivo.name;
      const referencia = this.storage.ref(ruta);
      const tarea = referencia.put(archivo);

      tarea.then((objeto) => {
        referencia.getDownloadURL().subscribe((url) => {
          this.imgUrl = url;
        });
      });

      tarea.percentageChanges().subscribe((porcentaje) => {
        this.porcentajeSubida = parseInt(porcentaje.toString());
      });
    }
  }
}
