import { Injectable } from '@angular/core';
import {Socket} from 'ng2-socket-io';
@Injectable()
export class GunSocketService extends Socket {

  constructor() { 
    super({url:"https://absentiagungen.tech",options:{}})

    
  }




}
