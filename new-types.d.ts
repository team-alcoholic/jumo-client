// Types

interface MeetingListResponse {
  meetings: MeetingInfo[];
  cursorId: number;
  eof: boolean;
  cursorDate: string | null;
}

interface MeetingInfo {
  id: number;
  uuid: string;
  name: string;
  status: string | null;
  meetingAt: string | null;
  fixAt: string | null;
  region: string | null;
  liquors: string | null;
  participatesMin: number | null;
  participatesMax: number | null;
  payment: number | null;
  byob: boolean;
  thumbnail: string;
  externalService: string | null;
  createdAt: string;
}

interface MeetingDetailInfo extends MeetingInfo {
  place: string | null;
  paymentMethod: string | null;
  byobMin: number | null;
  byobMax: number | null;
  description: string;
  externalLink: string;
  images: string[];
}

/** 주류 type: ES 버전 */
interface LiquorInfo {
  id: number;
  en_name: string;
  ko_name: string;
  price: string;
  thumbnail_image_url: string;
  tasting_notes_Aroma: string;
  tasting_notes_Taste: string;
  tasting_notes_Finish: string;
  type: string;
  volume: string;
  abv: string;
  country: string;
  region: string;
  grape_variety: string;
  notes_count: number;
}

/** 주류 type: DB 버전 */
interface LiquorData {
  thumbnailImageUrl: string | null;
  koName: string | null;
  enName: string | null;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  tastingNotesAroma: string | null;
  tastingNotesTaste: string | null;
  tastingNotesFinish: string | null;
  region: string | null;
  grapeVariety: string | null;
  aiNotes: aiNotes | null;
}

/** 사용자 type */
interface User {
  id: number;
  provider: string | null;
  providerId: string | null;
  profileNickname: string | null;
  profileImage: string | null;
  profileThumbnailImage: string | null;
}

/** 테이스팅노트 type: 주류 상세정보 페이지에서 보이는 유저 테이스팅 리뷰 목록 API 응답 객체 타입 */
interface TastingNoteList {
  id: number;
  liquor: LiquorData;
  noseScore: number | null;
  palateScore: number | null;
  finishScore: number | null;
  noseMemo: string | null;
  palateMemo: string | null;
  finishMemo: string | null;
  overallNote: string | null;
  mood: string | null;
  noseNotes: string | null;
  palateNotes: string | null;
  finishNotes: string | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  user: User;
}

// Props Types

/** LiquorTitle 컴포넌트 호출 시 사용되는 props type */
interface LiquorTitleProps {
  thumbnailImageUrl: string | null;
  koName: string | null;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  region: string | null;
  grapeVariety: string | null;
}

/** KeyValueInfoComponent 호출 시 사용되는 props type */
interface KeyValueInfoProps {
  keyContent: string | null;
  valueContent: string | null;
  keyMinWidth: number;
}
