import { HttpHeaders } from "@angular/common/http";

export const pathLinks = {
    globalUrl : "http://localhost:5000/api/"
}
import { DatePipe } from '@angular/common';

export const convertToDateTimeFormat = (date: any,datePipe:DatePipe): string|boolean =>{

    let oDob = new Date(date['year'], date['month']-1,  date['day']);
    try{
      var d = datePipe.transform(oDob, 'yyyy-MM-ddTHH:mm:ss');
      return d;
    }catch(error){
      return false;
    }
 
  }

export const getLocalStorage = (itemName:string) :any =>{
    var item = localStorage.getItem(itemName);
    if (item !== null) {
      return JSON.parse(item)
    }
    return null
}
export const setLocalStorage = (itemName:string, object:any) : any=>{
    return localStorage.setItem(itemName, JSON.stringify(object))
}
export const parseJwt = (token : string) : any=> {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
  
      return JSON.parse(jsonPayload);
}
export const getUser = () : any=> {
      var token = localStorage.getItem("token");
      return parseJwt(token);
}
export const IsLoggedAdmin = () : boolean =>{
  var token = localStorage.getItem("token");

  if(!token)
    return false

    var payload = parseJwt(token)
    var currentTimestamp = Math.round(Date.now() / 1000);
    var tokenTimestamp = payload.exp;
  
    if (tokenTimestamp < currentTimestamp) {
      return false;
    }

    var actorData = JSON.parse(payload.ActorData);

    if(actorData.Role != "Admin"){
      return false;
    }

    return true

}
export const isLoggedIn = () : boolean => {
      var token = localStorage.getItem("token");
  
      if (!token) {
        return false;
      }
  
      var payload = parseJwt(token);
  
      var currentTimestamp = Math.round(Date.now() / 1000);
      var tokenTimestamp = payload.exp;
  
      if (tokenTimestamp < currentTimestamp) {
        return false;
      }
  
      return true;
}
export const removeToken = (): void => {
      var token = localStorage.getItem("token");
      if (token) localStorage.removeItem("token");
}
export const token = () : string=> {
    return JSON.parse(localStorage.getItem("token"));
}
export const isImageOrVideoExtension = (file:string) : string=>{
  const imageExtensions = ['jpg', 'jpeg', 'png'];
    const videoExtensions = ['mp4', 'mov', 'wmv'];
    const fileExtension = file.split('.').pop().toLowerCase();

    if (imageExtensions.includes(fileExtension)) {
      return 'image';
    } else if (videoExtensions.includes(fileExtension)) {
      return 'video';
    } else {
      return 'none';
    }
}
const getTokenFromLocalStorage = (): string => {
  return JSON.parse(localStorage.getItem("token") || 'null');
};
export const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer '+ getTokenFromLocalStorage(),
    })
  };
export const httpOptionsMTD = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem("token")),
    "Contetn-type":"multipart/form-data"
  })
};

