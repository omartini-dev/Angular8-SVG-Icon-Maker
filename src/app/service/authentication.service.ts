import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User, RegUser } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}
	register(reguser: RegUser) {
		return this.http.post<any>(`${environment.apiUrl}register`, reguser)
			.pipe(map(user => {
				if(typeof(user['success'])!='undefined' && !user['success']){
					return user['error'];
				}
				const expirationDate = new Date(new Date().getTime() + 60*60*1000).getTime().toString();
				localStorage.setItem('currentUser', JSON.stringify(user));
				localStorage.setItem('expirationDate', expirationDate);
				this.currentUserSubject.next(user);
				return 'success';
			}));
	}
	login(email, password) {
		return this.http.post<any>(`${environment.apiUrl}login`, { email, password })
			.pipe(map(user => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				const expirationDate = new Date(new Date().getTime() + 60*60*1000).getTime().toString();
				localStorage.setItem('currentUser', JSON.stringify(user));
				localStorage.setItem('expirationDate', expirationDate);
				this.currentUserSubject.next(user);
				return user;
			}));
	}

	logout() {
		// remove user from local storage and set current user to null
		localStorage.removeItem('currentUser');
		localStorage.removeItem('expirationDate');
		this.currentUserSubject.next(null);
	}
}