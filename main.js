const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const topic = require('./lib/topic');
var db = require('./lib/db');

const app = express();

const port = 3000;

const secretKey = 'your_secret_key';

app.set('view engine', 'ejs');  // view engine : 템플릿 엔진 선택 키
app.set('views', './views'); // views : 템플릿 파일 디렉터리 선택 키
app.use(bodyParser.urlencoded({extended: false})); // post body 데이터 받아오기 위함
app.use(express.json());

// JWT 생성 함수
function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
}

// JWT 검증 미들웨어
function authenticateToken(request, response, next) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return response.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return response.sendStatus(403);
    request.user = user;
    next();
  });
}

// function authenticateUser(id, pw) {

// }

// 회원가입 페이지
app.get('/signup', (request, response) => {
  response.render('signup', {message : null});
});

// 회원가입 기능
app.post('/signup', (request, response) => {
  const id = request.body.id; // DB컬럼명 : name
  const pw = request.body.pw;
  const profile = request.body.profile;

  let sql = `SELECT * FROM author WHERE name=?`;
  db.query(sql, [id], function(error, result){
    if(error) {
      return response.status(500).json({error: 'Database query failed'});
    }
    // 이미 존재하는 id일 경우
    if(result.length !== 0) {
      return response.render('signup', { message: '이미 존재하는 ID입니다'});
    }
    // 회원가입 가능할 경우
    else {
      sql = `INSERT INTO author(name, profile, password) VALUES(?, ?, ?)`;
      db.query(sql, [id, profile, pw], function(error, result){
        if(error) {
          return response.status(500).json({error: 'Database query failed'});
        }
        // 회원가입에 성공했을 경우
        if(result.affectedRows === 1) {
          return response.send(`<script>alert('회원가입 성공!'); location.href='/';</script>`)
        }
      });
    }
  });
});

// 로그인 페이지
app.get('/login', (request, response) => {
  response.render('login', {message : null});
});

// 로그인 기능 및 JWT 생성
app.post('/login', (request, response) => {
  // 유저가 로그인 폼에 입력한 id, pw
  const { id, pw } = request.body;

  let sql = `SELECT * FROM author WHERE name=?`;
  db.query(sql, [id], function(error, result){
    if(error) {
      return response.status(500).json({error: 'Database query failed'});
    }
    // id에 해당하는 유저가 없다면
    if(result.length === 0) {
      return response.status(401).json({message: '존재하지 않는 ID입니다'});
    }
    // id가 존재할 경우 pw 일치여부 확인
    else {
      if(result[0].password === pw) {
        const user = { id: id };
        const accessToken = generateToken(user);
        response.json({ accessToken });
      }
      // id는 존재하지만 pw가 일치하지 않을 경우
      else {
        return response.status(401).json({message: '비밀번호가 일치하지 않습니다'});
      }
    }
  }); 
});


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