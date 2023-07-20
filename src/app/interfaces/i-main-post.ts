import { IComment } from "./i-comment";
import { IMainUserPost } from "./i-main-user-post";

export interface IMainPost {
    id:number,
    path:Array<string>,
    privacyId:number,
    title:string,
    content:string,
    likesCounter:number,
    createdAt:Date,
    whichFile: Array<boolean>,
    commentsCounter:number,
    comments:Array<IComment>
    name:IMainUserPost
}
