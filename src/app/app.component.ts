import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DbService } from './services/db.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fire-base';
  data = {
    email: 'Ahmed@info.com',
    password: '123123'
  }
  id = 'm8P8JIi9sqDKyZ0K5tAM'
  constructor(private _auth: AuthService, private _userService: UserService ,private _db:DbService) { }




  register(data: { email: string; password: string; }) {
    this._auth.Register(data).subscribe((res) => {
      console.log("regisert", res);
      this._userService.CreateUser({ email: res.email, uid: res.uid }).then(response => {
        console.log(response);
      })

    });
  }
  login(data: { email: string; password: string; }) {
    this._auth.Login(data).subscribe((res) => {
      console.log("login", res);
      this._auth.SetToken(res.accessToken);
    }
    );
  }

  getUser(id: string) {
    this._userService.GetUserById(id).subscribe(res => {
      console.log(res);
    })
  }
  getAllUser() {
    this._userService.GetAllUser().subscribe(res => {
      console.log(res);
    })
  }
  updateUser() {
    this._userService.UpdateUser(this.id, { email: 'makleed@gmail.com' }).subscribe(res => {console.log(res);} )

  }

  addC(){
    this._db.AddDoc('testse',{name:'ahmed'}).subscribe(res=>console.log(res))
  }
  getAll(){
    this._db.GetAll('testse').subscribe(res=>console.log(res))
  }
  getId(id:any){
    this._db.GetById('testse',id).subscribe(res=>console.log(res))
  }


  getQuery(){
    this._db.GetByQuery('tesstse',{key:'name', operator: '==', value:'ahmed'}).subscribe(res=>console.log(res))
  }

  removeDoc(){
    this._db.RemoveDoc('testsee','vXb4k1zgDKqZNda0yQOt').subscribe(res=>console.log(res))
  }


}
