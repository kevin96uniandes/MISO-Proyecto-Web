import { HttpInterceptorFn } from '@angular/common/http';
import {inject, Injector} from '@angular/core';
import {StorageService} from "../common/storage.service";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const storageService = injector.get(StorageService)
  const token = storageService.getItem("token");

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Technology: "WEB"
    }
  });
  return next(clonedReq);
};

