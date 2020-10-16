export default class  Item{
    title = null;
    votes = null;
    
    constructor(title, votes=0){
        this.title = title;
        this.votes = votes;
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