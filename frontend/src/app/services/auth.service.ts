import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());

  constructor() {}

  private getUserFromStorage(): any {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  login(user: any) {
    const userEmailOnly = { email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(userEmailOnly));
    this.currentUserSubject.next(userEmailOnly);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
