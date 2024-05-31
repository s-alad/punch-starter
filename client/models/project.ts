
import { CHAINS } from './chains';
import Milestone from './milestone';

export default interface Project {
    pid: string;
    name: string;
    chain: CHAINS;
    display: string;
    owner: {
        username: string;
        uid: string;
    }
    upvotes: number;
    punchline: string;
    description: string;
    deployed: boolean;
    goal: number;
    raised: number;
    expiry: string;
    comments?: string[];
    upvoteslist?: string[];
}