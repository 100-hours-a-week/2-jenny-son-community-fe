# 아무 말 대잔치 커뮤니티 프론트엔드 프로젝트

## 1. 프로젝트 소개

Vanilla JS로 구현한 커뮤니티 프론트엔드 프로젝트입니다.

주요 기능으로는 회원가입과 로그인, 게시글 작성, 댓글 작성, 좋아요가 있습니다.

[(📂 백엔드 프로젝트 리포지토리)](https://github.com/100-hours-a-week/2-jenny-son-community-be)

## 2. 사용 기술

JavaScript, HTML, CSS

## 3. 설계

### 1) API 설계

[🔗 API 문서 바로가기](https://www.notion.so/1bb258f8f61980fab751f83b11554fc6?pvs=21)

<details>
  <summary>API 문서 사진</summary>
  <div markdown="1">
    <ul>
      <img src="https://github.com/user-attachments/assets/a4be46cc-6abb-4e8e-85bb-e7811b2e4ebf" width=70%>
      <img src="https://github.com/user-attachments/assets/ca50e8cc-8a9d-4b36-b395-fc5759509419" width=70%>
      <img src="https://github.com/user-attachments/assets/dfc0ba37-5765-43dd-93cf-06f0d3992ece" width=70%>
    </ul>
  </div>
</details>

### 2) 프로젝트 구조

```javascript
community-fe
├── public
├── src
│   ├── components       // 공통 컴포넌트                  
│   │   └── header                 
│   ├── pages            // 페이지별 폴더 (javascript, html, css)
│   │   ├── login        // - 로그인 페이지         
│   │   ├── post         // - 게시글 목록, 게시글 상세, 게시글 작성, 게시글 수정 페이지
│   │   ├── profile      // - 회원정보 수정, 비밀번호 변경 페이지
│   │   └── signup       // - 회원가입 페이지
│   └── utils            // 공통 유틸리티 함수
├── db.json              // 로컬 API/mock 데이터 (json-server용)
├── package-lock.json    // 의존성 버전 고정을 위한 파일
└── package.json         // 프로젝트 설정 및 의존성 목록
```

## 4. 기능

[🔗 시연 영상 보러가기](https://www.youtube.com/watch?v=CDuhguLbHp4)

- 회원가입 (signup.html)
  - 이메일, 비밀번호, 비밀번호 확인, 닉네임 입력
  - 프로필 이미지 업로드 (이미지 업로드 후 미리보기, 업로드 이후 클릭하고 업로드 하지 않으면 프로필 이미지 삭제)
  - 이메일, 비밀번호, 닉네임 유효성 검사
  - 회원가입
  - 회원가입 성공 시 로그인 페이지로 이동
 
    
- 로그인 (login.html)
  - 이메일, 비밀번호 유효성 검사
  - 회원가입 페이지로 이동
  - 로그인
  - 로그인 성공 시 게시글 목록 페이지로 이동
- 게시판 (post.html)
  - 게시글 목록 조회, 댓글 목록 조회 요청
  - 게시글 리스트 인피니티 스크롤
  - 게시글을 누르면 게시글 상세 페이지로 이동
  - 게시글 작성 버튼을 눌러 게시글 작성 페이지로 이동
- 게시글 (post-detail.html)
  - 게시글 상세 조회 요청
  - 댓글 등록/수정/삭제 기능
  - 좋아요 기능
  - 작성자인 경우 게시글 수정, 삭제 기능
- 게시글 작성 (post-write.html)
  - 제목, 본문 입력, 이미지 업로드
  - 게시글 작성 요청
- 게시글 수정 (post-edit.html)
  - 게시글 상세 조회 요청해 입력폼 채우기
  - 제목, 본문, 이미지 수정
  - 게시글 수정 요청
- 회원정보 수정 (edit-profile.html)
  - 회원정보 조회 요청해 페이지 채우기
  - 프로필 이미지, 닉네임 입력, 유효성 검사, 통과 시 버튼 활성화
  - 수정 성공 시 토스트 메시지
  - 회원 탈퇴 
- 비밀번호 변경 (edit-password.html)
  - 비밀번호, 비밀번호 확인 입력, 유효성 검사, 통과 시 버튼 활성화
  - 변경 성공 시 토스트 메시지
- 헤더 (header.html)
  - 로그인 여부에 따라 헤더에 프로필/로그인 버튼을 다르게 보여줌 
  - 회원정보 조회 요청을 통해 프로필 이미지, 토큰 상태 갱신
  - 로그인 사용자가 프로필 클릭 시 드롭다운
  - 드롭다운에서 회원정보 수정, 비밀번호 수정 페이지로 이동, 로그아웃 기능
  - 로그아웃 처리

![로그인](https://github.com/user-attachments/assets/76ec1a22-168e-496d-b510-35fa236e33cb)
![회원가입](https://github.com/user-attachments/assets/f66505a2-4643-421d-a4bb-2ed93cdea80c)
![게시판](https://github.com/user-attachments/assets/d3c18cd4-f1d9-40a7-ad8d-9b2caaf7c777)
![게시글](https://github.com/user-attachments/assets/c0f78a82-c25b-4c03-96e5-82b2677fba6e)
![게시글 수정](https://github.com/user-attachments/assets/13ea96e0-857f-49d5-8cf0-681d06e5cda4)
![게시글 삭제 모달](https://github.com/user-attachments/assets/85f0a7f9-308e-4d4a-b8ee-6539a99b2229)
![게시글 작성](https://github.com/user-attachments/assets/afbe5c59-2806-4d77-b519-e4263e255c45)
![댓글 기능](https://github.com/user-attachments/assets/d6293772-de59-4a81-8745-4157c18826af)
![댓글 수정](https://github.com/user-attachments/assets/74409b9a-ba43-483c-8419-9f41f536ccd9)
![댓글 삭제](https://github.com/user-attachments/assets/e0d174ba-0591-4662-8b2a-b23db30b45af)
![회원정보 수정](https://github.com/user-attachments/assets/3f6ddcea-afe8-4bca-b732-98e84513b726)
![비밀번호 변경](https://github.com/user-attachments/assets/0dc29dc9-dadd-4bc9-bc6c-ff0d15af1a8f)


