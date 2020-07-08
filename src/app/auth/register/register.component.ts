import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private AuthService: AuthService,
               private store: Store<AppState>,
               private router: Router ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:   [ '', Validators.required ],
      correo:   [ '', Validators.required ],
      password: [ '', Validators.required ],
    })

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      
      this.cargando = ui.isLoading;

      console.log( 'cargando subs register' );

    });

  }

  ngOnDestroy() {

    this.uiSubscription.unsubscribe();

  }

  crearUsuario(): void {

    if( this.registroForm.invalid ) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    this.AuthService.crearUsuario( nombre, correo, password )
    
      .then( credenciales => { 
        
        console.log( credenciales ); 

        // Swal.close(); this.cargando
        this.store.dispatch( ui.stopLoading() );

        this.router.navigate(['/']) 
        
      })
        
      .catch( err => {

        this.store.dispatch( ui.stopLoading() );
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
        
      });

  }
}
