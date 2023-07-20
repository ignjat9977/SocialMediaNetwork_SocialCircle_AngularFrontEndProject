import { IComment } from "./i-comment";

export interface IPost{
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

} 