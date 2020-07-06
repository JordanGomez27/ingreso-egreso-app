import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor( private fb: FormBuilder,
               private AuthService: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   [ '', Validators.required ],
      correo:   [ '', Validators.required ],
      password: [ '', Validators.required ],
    })
  }

  crearUsuario(): void {

    if( this.registroForm.invalid ) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })

    this.AuthService.crearUsuario( nombre, correo, password )
    
      .then( credenciales => { 
        
        console.log( credenciales ); Swal.close(); this.router.navigate(['/']) 
        
      })
        
      .catch( err => console.error( err ) );

  }
}
