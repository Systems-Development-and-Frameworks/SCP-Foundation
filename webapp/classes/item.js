export default class  Item{
    id = null;
    title = null;
    votes = null;
    author = null;

    constructor(id, title, votes=0, author){
        this.id = id;
        this.title = title;
        this.votes = votes;
        this.author = author;
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

    getAuthor(){
      return this.author;
    }

    setTitle(title){
        this.title = title;
    }

    setVotes(votes){
        this.votes = votes;
    }

    setAuthor(author){
      this.author = author;
    }
}
