import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";
import { AuthService } from "../pages/auth/auth.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class TokenService {


  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
  ) {}

  startTokenValidationCheck() {
    setInterval(() => {
      let token = this.storageService.getItem("token");
      if (token) {
        this.authService.validateToken(token).subscribe({
          error: () => {
            this.storageService.clear();
            this.router.navigate(["login"]);
          }
        })
      }else {
        this.router.navigate(["login"]);
      }
    }, 6000);
  }
}
