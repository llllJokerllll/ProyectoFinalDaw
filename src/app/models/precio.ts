import { DocumentReference } from '@angular/fire/firestore';

export class Precio {
  id: string;
  nombre: string;
  coste: number;
  duracion: number;
  tipoDuracion: number;
  ref: DocumentReference;

  constructor() {}
}
