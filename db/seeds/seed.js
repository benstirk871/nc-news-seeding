const db = require("../connection")
const format = require('pg-format')
const { convertTimestampToDate } = require('./utils');
const articles = require("../data/test-data/articles");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(()=>{
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE topics (slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR(1000))`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE users (username VARCHAR PRIMARY KEY, name VARCHAR, avatar_url VARCHAR(1000))`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR, topic VARCHAR REFERENCES topics(slug), author VARCHAR REFERENCES users(username), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))`)
  })
  .then(() =>{
    return db.query(`CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
  })
  .then(()=>{
          
    const formattedTopicData = topicData.map((topic)=>{
      return [topic.slug, topic.description, topic.img_url];
    })
      
    const topicsInsertStr = format(`INSERT INTO topics(slug, description, img_url) VALUES %L`, formattedTopicData)

    return db.query(topicsInsertStr)
  })
  .then(()=>{
    
    const formattedUserData = userData.map((user)=>{
      return [user.username, user.name, user.avatar_url];
    })

    const usersInsertString = format(`INSERT INTO users (username, name, avatar_url) VALUES %L`, formattedUserData)

    return db.query(usersInsertString)
  })
  .then(()=>{

    const formattedArticleData = articleData.map((article)=>{
    return [article.title, article.topic, article.author, article.body, convertTimestampToDate(article.created_at).created_at, article.votes, article.article_img_url]
    })
    
    const articlesInsertString = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L`, formattedArticleData)

    return db.query(articlesInsertString)
  })
  .then(()=>{

    const formattedCommentData = commentData.map((comment) =>{
      return [comment.body, comment.votes, comment.author, convertTimestampToDate(comment.created_at).created_at]
    })

    const commentsInsertString = format(`INSERT INTO comments (body, votes, author, created_at) VALUES %L`, formattedCommentData)
    
    return db.query(commentsInsertString)
  })

       
  
};
module.exports = seed;
