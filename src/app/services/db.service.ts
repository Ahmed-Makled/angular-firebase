import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  docData,
  setDoc,
  deleteDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
} from "@angular/fire/firestore";
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { addDoc, updateDoc } from 'firebase/firestore';
import { catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DbService {
  uploadPercent?: Observable<number>;
  public url: any;
  constructor(private firestore: Firestore, private storage: Storage) { }
  //getAll
  GetAll(collectionName: any): Observable<any> {
    const data = collection(this.firestore, collectionName);
    return from(collectionData(data)).pipe(
      catchError((error) => {
        return throwError(() => new Error(`Get Docs failed, error: ${error.messsage}`));
      }))
  }
  //get by id
  GetById(collectionName: any, id: any): Observable<any> {
    let data = doc(this.firestore, collectionName, id);
    return from(docData(data)).pipe(
      catchError((error) => {
        return throwError(() => new Error(`Get Docs failed, error: ${error.messsage}`));
      })
    )
  }
  GetByQuery(collectionName: any, condetion: { key: any, operator: any, value: any }) {
    const data = query(
      collection(this.firestore, collectionName),
      where(condetion.key, condetion.operator, condetion.value)
    )
    return from(collectionData(data)).pipe(
      catchError((error) => {
        return throwError(() => new Error(`Get Doc failed, error: ${error.messsage}`));
      })
    );
  }
  //add
  AddDoc(collectionName: any, data: any) {
    const newDoc = doc(collection(this.firestore, collectionName))
    return from(setDoc(newDoc, { ...data, id: newDoc.id })).pipe(
      switchMap(() => this.GetById(collectionName, newDoc.id)),
      catchError((error) => {
        return throwError(() => new Error(`Add Doc failed, error: ${error.messsage}`));
      })
    )
  }
  //update
  UpdateDoc(collectionName: any, idDoc: string, newData: any): Observable<any> {
    return from(updateDoc(doc(this.firestore, collectionName, idDoc), newData)).pipe(
      switchMap(() => this.GetById(collectionName, idDoc)),
      catchError((error) => {
        return throwError(() => new Error(`Update Doc failed, error: ${error.messsage}`));
      })
    )
  }
  //remove
  RemoveDoc(collectionName: any, idDoc: string): Observable<any> {
    return from(deleteDoc(doc(this.firestore, collectionName, idDoc))).pipe(
      catchError((error) => {
        return throwError(() => new Error(`Remove Doc failed, error: ${error.messsage}`));
      })
    )
  }
  async upload(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    {
      if (file) {
        try {
          const storageRef = ref(this.storage, path);
          const task = uploadBytesResumable(storageRef, file);
          await task;
          this.url = await getDownloadURL(storageRef);
          console.log(this.url);
          console.log(task);
        } catch (e: any) {
          console.error(e);
        }
      } else {
        // handle invalid file
      }
      return this.url;
    }
  }
}
