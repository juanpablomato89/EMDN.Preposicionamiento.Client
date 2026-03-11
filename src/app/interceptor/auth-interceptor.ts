import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = [
    '/login',
    '/register',
    '/forgot-password',
  ];

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};