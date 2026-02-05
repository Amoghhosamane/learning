import { Server as IOServer } from "socket.io";

declare global {
  var __io: IOServer | undefined;
  var __liveClasses: Map<string, any> | undefined;
  var __server: any;
}

//declare glbal{
//{var __io:IOServer | undefined;
//var __liveClasses:Map<string, any> ~ undefined;}
//var+
//
//
//
//}
export {};
