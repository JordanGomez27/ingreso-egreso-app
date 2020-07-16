import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {

    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;// elimina la propiedad para que no se grabe

    return this.firestore.doc(`${uid}/ingresos-egresos`)

      .collection('items')

      .add({ ...ingresoEgreso });

  }

  initIngresosEgresosListener( uid: string ) {

    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)

      .snapshotChanges()

      .pipe(

        map(snapshot => snapshot.map(doc => ({

          // doc.payload.doc.data().uid = doc.payload.doc.id,

          uid: doc.payload.doc.id,

          ...doc.payload.doc.data() as any

            })
          )
        )
      )
  }
  
  borrarIngresoEgreso( uidItem: string ){

    const uid = this.authService.user.uid;

    return this.firestore.doc(`${ uid }/ingresos-egresos/items/${ uidItem }`).delete(); 

  }

}
