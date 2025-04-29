const db = require("../db/connection")


const selectCommentsByArticleId = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404, msg: `No comments with article_id of ${article_id}`
            })
        } else {
            return rows
        }
    })
}

module.exports = selectCommentsByArticleId;