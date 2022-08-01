import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'users'

  constructor(private _db: DbService) {


  }

  async CreateUser(data: any) {
    return await this._db.AddDoc(this.collectionName, data)
  }
  GetUserById(id: string): Observable<any> {
    return this._db.GetById(this.collectionName, id)
  }
  GetAllUser(): Observable<any> {
    return this._db.GetAll(this.collectionName)
  }
  UpdateUser(id:any,data:any) {
    return this._db.UpdateDoc(this.collectionName, id, data)
  }
}