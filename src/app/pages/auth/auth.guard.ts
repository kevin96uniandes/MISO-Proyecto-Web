import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from "@angular/core";
import {StorageService} from "../../common/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const token = this.storageService.getItem('token');
    if (token) {
      // Si hay un token, redirigir al dashboard
      this.router.navigate(['/dashboard']);
      return false; // No permitir la navegación al login
    }
    return true; // Permitir la navegación al login
  }
}
