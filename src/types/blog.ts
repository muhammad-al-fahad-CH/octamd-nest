export interface Files {
    originalname: string,
    uniqueName: string,
    url: string
}

export interface inputBlog {
    readonly title: string,
    readonly shortDescription: string,
    readonly appCategory: string,
    readonly blogCategory: string,
    readonly mainBanner: Files[],
    readonly status: string,
    readonly description: string,
    readonly publishedAt: string
}