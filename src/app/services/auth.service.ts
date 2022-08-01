import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, defer, from, map, Observable, switchMap, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router,) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify({ IsLogin: true }));
      }
    });
  }
  /* Register */
  Register(data: { email: string; password: string; }): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, data.email, data.password))
      .pipe(
        map(credential => credential.user),
        tap(user => {
          console.log('signed up with email and password succesfully, user:', user);
        }),
        catchError((error, obs) => {
          console.error('signup with email and password failed, error:', error);
          return obs;
        })
      );
  }
  /* Login */
  Login(data: { email: string; password: string; }): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, data.email, data.password))
      .pipe(
        map(credential => credential.user),
        tap(user => {
          console.log('signed in with email and password succesfully, user:', user);
        }),
        catchError((error, obs) => {
          console.error('signin with email and password failed, error:', error);
          return obs;
        })
      );
  }

 async Logout() { await signOut(this.auth) ; await this.RemoveToken() ;await this.RemoveUser() ;this.router.navigate(['/login']); }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || null || '');
    const token = JSON.parse(localStorage.getItem('token') || null || '');
    return ((user !==null || user!='') && (token !==null || token!='')) ? true : false;
  }
  SetToken(token: string) {
    localStorage.setItem('token', token);
  }
  RemoveToken() {
    localStorage.removeItem('token');
  }
  RemoveUser() {
    localStorage.removeItem('user');
  }

}
