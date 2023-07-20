export interface IComment {
    id:number,
    content:string,
    userId:number|null,
    postId:number|null,
    parentId:number|null,
    userFirstAndLast:string,
    userImagesPaths:Array<string>
    likesCounter:number,
    createdAt:Date,
    comments:Array<IComment>
}
