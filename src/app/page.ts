export class Page {

    constructor(
        public currentStart: number,
        public numPerPage: number,
        public totalItems: number,
        public maxStart: number
    ) {}
}
