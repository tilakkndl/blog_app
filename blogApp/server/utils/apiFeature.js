const AppError = require("./appError");

class ApiFeature {
    constructor(query, queryStirng){
        this.query = query;
        this.queryStirng = queryStirng;
    }

    search(){
        const keyword = this.queryStirng.keyword ? {
            keywords: {
                $regex: this.queryStirng.keyword,
                $options: 'i'
            }  
        }: {}
        this.query = this.query.find(keyword);
        return this;
    }

 pagination(blogPerPage){
   const  currentPage=Number(this.queryStirng.page ) || 1;
    const skipBlog = blogPerPage*(currentPage-1);
    this.query = this.query.limit(blogPerPage).skip(skipBlog);
    return this
 }
    
}

module.exports = ApiFeature;