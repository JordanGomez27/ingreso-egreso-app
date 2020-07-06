import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // nombre:   [ '', Validators.required ],
      email:    [ '', Validators.required ],
      password: [ '', Validators.required ]
    })
  }

  login(): void {
    if( this.loginForm.invalid ) { return; }

    const { email, password } = this.loginForm.value;

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })

    this.authService.loginUsuario( email, password ).then( usuario => {

      console.log( usuario );

      Swal.close()

      this.router.navigate([ '' ]);

    })

    .catch( err => Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
      footer: '<a href>Why do I have this issue?</a>'
    }));

  }
}
