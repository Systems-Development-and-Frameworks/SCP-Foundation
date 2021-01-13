export default class  Item{
    id = null;
    title = null;
    votes = null;
    
    constructor(id, title, votes=0){
        this.id = id;
        this.title = title;
        this.votes = votes;
    }

    getId(){
        return this.id;
    }
    
    getTitle(){
        return this.title;
    }

    getVotes(){
        return this.votes;
    }

    setTitle(title){
        this.title = title;
    }

    setVotes(votes){
        this.votes = votes;
    }
}