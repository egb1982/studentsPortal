export class Post {
    constructor(
        public type: string,
        public title: string,
        public text: string,
        public document: File
    ){}
}