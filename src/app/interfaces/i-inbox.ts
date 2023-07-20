import { IMessages } from "./i-messages";

export interface IInbox {
    senderId:number,
    reciverId:number,
    senderName:string,
    reciverName:string,
    firstThreeMessages: Array<IMessages>
}
