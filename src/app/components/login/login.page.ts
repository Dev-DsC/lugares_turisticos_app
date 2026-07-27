import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginPage implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lugares';
    if (this.auth.isLogged()) {
      this.router.navigateByUrl(this.returnUrl || '/lugares');
    }
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: async () => {
        await this.toast.show('Inicio de sesión exitoso', 'success', 1800);
        this.router.navigateByUrl(this.returnUrl || '/lugares');
      },
      error: async (err) => {
        console.error('Login error', err);
        await this.toast.show(
          err?.error?.mensaje || 'Error al iniciar sesión',
          'danger',
          2500,
        );
      },
    });
  }
}
