export class Comment {
    constructor(
        public publicationId: string,
        public user: string,
        public created_At: string,
        public text: string
    ){}
}

