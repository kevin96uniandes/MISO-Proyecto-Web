import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from "@angular/core";
import {StorageService} from "../../common/storage.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    const token = this.storageService.getItem('token'); 
    if (token) {
      return true; 
    } else {
      this.router.navigate(['/login']); 
      return false; 
    }
  }
}
