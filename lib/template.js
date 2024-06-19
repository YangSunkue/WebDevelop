module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
      <style>
        .button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #0056b3;
        }
          
      </style>
      <meta charset="utf-8">
    </head>
    <body>
      <p>
      <button type="button" class="btn btn-outline-danger" onclick="location.href='/signup'">회원가입</button>
      </p>
      <button type="button" class="btn btn-outline-danger" onclick="location.href='/login'">로그인</button>
      <div class="alert alert-warning" role="alert">
      <h1><a href="/">WEB</a></h1>
      </div>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors, author_id) { // author_id : 글쓴이id
    var tag = '';

    for(var i = 0; i < authors.length; i++) {
      var selected = '';
      if(author_id === authors[i].id) {
        selected = ' selected';
      }
      // 글쓴이 id에 해당하는 선택지를 체크박스 기본값으로 한다
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
    }

    return `
      <select name="author">
        ${tag}
      </select>
    `;
  }
}
