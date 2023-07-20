export interface IUser {
    id:number,
    firstName:string,
    lastName: string,
    email:string,
    dateOfBirth:Date,
    imagesPath:Array<string>,
    numberOfFriends:number,
    isAlreadyMyFriend:boolean|null
}