export interface IPageResponse<T> {
    currentPage:number,
    itemsPerPage:number,
    totalCount:number,
    items: Array<T>
}
