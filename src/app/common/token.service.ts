import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";
import { AuthService } from "../pages/auth/auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenValidationInterval: any;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  startTokenValidationCheck() {
    this.tokenValidationInterval = setInterval(() => {
      let token = this.storageService.getItem("token");
      if (token) {
        this.authService.validateToken(token).subscribe({
          next: () => {
            // Token is valid; no action needed
          },
          error: () => {
            this.stopTokenValidationCheck();  // Detenemos el intervalo en caso de error
            this.storageService.clear();
            this.router.navigate(["login"]);
          }
        });
      } else {
        this.stopTokenValidationCheck();  // Detenemos el intervalo si no hay token
        this.router.navigate(["login"]);
      }
    }, 6000);
  }

  // Método para detener el intervalo
  stopTokenValidationCheck() {
    if (this.tokenValidationInterval) {
      clearInterval(this.tokenValidationInterval);
      this.tokenValidationInterval = null;
      this.router.navigate(["login"]);
    }
  }
}
