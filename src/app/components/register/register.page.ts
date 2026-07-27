import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class RegisterPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  private returnUrl: string | null = null;

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
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.auth.registro(email!, password!).subscribe({
      next: async () => {
        await this.toast.show('Usuario creado correctamente', 'success', 1800);
        this.router.navigateByUrl(this.returnUrl || '/lugares');
      },
      error: async (err) => {
        console.error('Registro error', err);
        await this.toast.show(
          err?.error?.mensaje || 'Error al registrar usuario',
          'danger',
          2500,
        );
      },
    });
  }
}
