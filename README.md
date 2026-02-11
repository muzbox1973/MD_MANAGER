# 마크다운 관리자 (MD Manager)

마크다운 및 텍스트 파일을 트리 구조로 관리하고 편집하는 한글 웹 앱입니다.

## 주요 기능

- **트리 파일 탐색기**: 폴더/파일을 트리 구조로 관리 (생성, 이름 변경, 삭제)
- **마크다운 편집기**: 실시간 마크다운 렌더링 지원
- **3가지 보기 모드**: 편집 / 미리보기 / 분할 보기
- **우클릭 컨텍스트 메뉴**: 파일/폴더 관리
- **사이드바 리사이즈**: 드래그로 사이드바 너비 조절
- **자동 저장**: localStorage에 자동 저장
- **GFM 지원**: 표, 취소선, 체크리스트 등

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (상태 관리)
- **react-markdown** + **remark-gfm** (마크다운 렌더링)

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 빌드

```bash
npm run build
npm start
```
