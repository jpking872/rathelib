export class Search {

    constructor(
        public author: string,
        public title: string,
        public keywords: string[],
        public recent: boolean,
        public magic: string[]
    ) {}
}
