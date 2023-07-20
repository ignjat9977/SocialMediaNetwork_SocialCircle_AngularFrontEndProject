export interface IReport {
    id:number,
    description:string,
    userId:number,
    reportedUserId:number,
    created:Date,
    postId:number
}