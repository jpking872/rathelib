export class Search {

    constructor(
        public keywords: string,
        public recent: string,
        public magic: string[],
        public start: number,
        public size: number
    ) {}
}
