import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const RoleGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router)

  let decoded = JSON.parse(sessionStorage.getItem("decodedToken")!!);
    console.log(decoded["user_type"]);

    const userRole = decoded["user_type"];
    const authorizedRole = route.data['role'];

    if (userRole === authorizedRole) {
      return true; 
    } else {
      router.navigate(['/']); 
      return false; 
    }
};
