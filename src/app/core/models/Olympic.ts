import { Participation } from "./Participation";

/* 
    Olympic Country model corresponding to objects from olympic.JSON 
*/

export class OlympicCountry {
    constructor(
        public id: number,
        public country: string,
        public participations: Participation[],
    ){}
    
}