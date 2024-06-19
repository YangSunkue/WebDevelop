module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
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
