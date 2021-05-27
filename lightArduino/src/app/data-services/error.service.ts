import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }
  public handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
      console.log('ha ocurrido un error: ', error.error.message);
    } else {
      console.error(
        `Error del servidor ${error.status}, ` +
        `${JSON.stringify(error.error)}`
      );

    }
    return throwError(
      `ha ocurrido un error, por favor inténtenlo nuevamente`
    );
  }
}
