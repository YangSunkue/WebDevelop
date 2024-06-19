// 모듈 가져오기, 경로는 현재 파일 기준
var db = require('./db');
var template = require('./template');


// 메인 페이지
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );

        // response.writeHead(200);
        response.send(html);
    });
}

// 글 상세보기
exports.page = function(request, response) {
    let id = request.query.id;
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) {
          throw error; // error를 콘솔에 출력하고 중지시킨다
        }
        // topic, author에서 id에 해당하는 컬럼 모두 가져오기
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [id], function(error2, topic){
            if(error2) {
                throw error2;
            }
          
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>`,
            ` <a href="/create">create</a>
                <a href="/update?id=${id}">update</a>
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <input type="submit" value="delete">
                </form>`
            );

            response.writeHead(200);
            response.end(html);
        });
    });
}

// 생성 페이지
exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){

            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            <form action="/create_process" method="post">
                <p>
                    <input type="text" name="title" placeholder="title">
                </p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    ${template.authorSelect(authors)}
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `,
            `<a href="/create">create</a>`
            );

            response.send(html);
        });
    });
}

// 생성 기능
exports.create_process = function(request, response) {
    var body = request.body;

    db.query(`
    INSERT INTO TOPIC(title, description, created, author_id) 
    VALUES(?, ?, NOW(), ?)`,
    [body.title, body.description, body.author],
    function(error, result){
        if(error) {
            throw error;
        }

        // 302 : 리다이렉트, Location : 리다이렉트 URL
        // AUTO_INCREMENT 속성이 설정된 필드는 insertId 함수로 가져올 수 있음
        // response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.send(`<script>alert('글 작성 성공!!'); location.href='/?id=${result.insertId}}';</script>`)
    });
}


// 수정 페이지
exports.update = function(request, response) {
    let id = request.query.id;  // 글 번호

    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) {
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [id], function(error2, topic){
            if(error2) {
            throw error2;
            }
            db.query(`SELECT * FROM author`, function(error2, authors){
                var list = template.list(topics);
                var html = template.HTML(topic[0].title, list,
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p>
                        <textarea name="description" placeholder="수정하세요.">${topic[0].description}</textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors, topic[0].author_id)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );

                response.send(html);
            });
        });
    });
}

// 수정 기능
exports.update_process = function(request, response) {
    let body = request.body;  

    // 3번째 : 수정한 사람 id, 4번째 : 글 번호 id
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [body.title, body.description, body.author, body.id], function(error, result){
        // response.writeHead(302, {Location: `/?id=${post.id}`});

    response.send(`<script>alert('업데이트 성공!!'); location.href='/?id=${body.id}';</script>`)
    })
}

// 삭제 기능
exports.delete_process = function(request, response) {
    var body = request.body;

    db.query(`DELETE FROM topic WHERE id=?`, [body.id], function(error, result){
        if(error) {
            throw error;
        }
        response.send("<script>alert('글이 삭제되었습니다.'); location.href='/';</script>")
    });
}
