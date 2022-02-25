export class Usuario {
    constructor(
        public _id: string,
        public email: string,
        public surname: string,
        public password: string,
        public imagePath: string
    ){}
}