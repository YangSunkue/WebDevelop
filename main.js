const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const topic = require('./lib/topic');
const port = 3000;

app.set('view engine', 'ejs');  // view engine : 템플릿 엔진 선택 키
app.set('views', './views'); // views : 템플릿 파일 디렉터리 선택 키
app.use(bodyParser.urlencoded({extended: false})); // post body 데이터 받아오기 위함

// 메인 페이지 + 글 상세보기
app.get('/', (request, response) => {
    if(request.query.id === undefined){
      topic.home(request, response);
    }
    else {
      topic.page(request, response);
    }
});
// 글 생성 페이지
app.get('/create', (request, response) => {
  topic.create(request, response);
});
// 글 생성 기능
app.post('/create_process', (request, response) => {
  topic.create_process(request, response);
});
// 글 수정 페이지
app.get('/update', (request, response) => {
  topic.update(request, response);
});
// 글 수정 기능
app.post('/update_process', (request, response) => {
  topic.update_process(request, response);
});
// 글 삭제 기능
app.post('/delete_process', (request, response) => {
  topic.delete_process(request, response);
});




// 서버 가동
app.listen(port, () => {
  console.log(`Server running... port: ${port}`);
});