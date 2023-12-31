import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CambiarClaveComponent } from './pages/cambiar-clave/cambiar-clave.component';
import { NgIconsModule, provideNgIconsConfig, provideNgGlyphs, provideNgIconLoader, withCaching } from '@ng-icons/core';
import { bootstrapEyeFill, bootstrapEyeSlashFill } from '@ng-icons/bootstrap-icons';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    CambiarClaveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    MatProgressSpinnerModule,
    SharedModule,
    NgIconsModule.withIcons({ bootstrapEyeFill, bootstrapEyeSlashFill }),
  ],
  providers: [
    provideNgIconsConfig({
      size: '20px',
    }),
  ],
})
export class LoginModule { }
