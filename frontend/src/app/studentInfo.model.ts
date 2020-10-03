export class StudentInfo{
    constructor(
        public studentId: number,
        public name: string,
        public surname: string,
        public email: string,
        public leave: boolean,
        public isAdmin: boolean
    ){}
}