
import moment from 'moment';
import 'moment/locale/ko';

export  const createdAt = (postCreatedAt : Date) => {
  const crAt = new Date(postCreatedAt);

  // Moment.js를 사용하여 작성 날짜를 현재 시간으로부터 얼마나 경과했는지 계산
  const timeDifference = moment().diff(crAt, 'minutes');

  // 작성 날짜에 대한 포맷 설정
  let displayFormat;

  if (timeDifference < 7 * 24 * 60) {
    // 현재 시간으로부터 7일 이내면 "n일 전"으로 표현
    displayFormat = moment(crAt).fromNow();
  } else {
    // 작성 년도 확인
    const currentYear = new Date().getFullYear();
    const postYear = crAt.getFullYear();

    // 이번 년도라면 "M월 DD일"로 표현
    if (postYear === currentYear) {
      displayFormat = moment(crAt).format("M월 DD일");
    } else {
      // 그 외에는 "YYYY년 M월 DD일"로 표현
      displayFormat = moment(crAt).format("YYYY년 M월 DD일");
    }
  }

  return displayFormat;
};