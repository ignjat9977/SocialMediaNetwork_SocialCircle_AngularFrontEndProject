import { IUser } from "./i-user"

export interface IFriendsAndFriendsOfFriends {
    friends: Array<IUser>
    friendsOf:Array<IUser>

}