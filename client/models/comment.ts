export default interface Comment {
    cid: string;
    comment: string;
    owner: {
        username: string;
        uid: string;
    }
}