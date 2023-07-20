import { IUser } from "./i-user";

export interface INotification {
    id:number,
    created: Date,
    description: string,
    whoMadeNotification : IUser
}
