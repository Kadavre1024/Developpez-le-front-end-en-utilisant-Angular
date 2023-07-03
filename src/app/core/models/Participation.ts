/* 
    Participation model corresponding to olympic sub-objects from olympic.JSON 
*/

export class Participation{
    constructor(
        public id: number,
        public year: number,
        public city: string,
        public medalsCount: number,
        public athleteCount: number,
    ){}
}