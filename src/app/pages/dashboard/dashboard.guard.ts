import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from "@angular/core";
import {StorageService} from "../../common/storage.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const token = this.storageService.getItem('token'); // Verifica si hay un token
    if (token) {
      return true; // Permite el acceso a la ruta si hay un token
    } else {
      this.router.navigate(['/login']); // Redirige a login si no hay token
      return false; // Bloquea el acceso
    }
  }
}
