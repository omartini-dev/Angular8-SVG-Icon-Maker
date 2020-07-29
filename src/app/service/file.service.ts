import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
	constructor(private http: HttpClient) {
	}

	download(svg, target, ids, bgid) {
    return this.http.post(environment.downUrl+target, {svg:svg, ids:JSON.stringify(ids), bgid:bgid}, {
      responseType: 'arraybuffer'});
  }
}
