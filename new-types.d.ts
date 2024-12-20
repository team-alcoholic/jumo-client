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

/** 주종 type */
interface LiquorCategory {
  id: number;
  name: string;
  image: string;
}

/** 주류 type: ES 버전 */
interface LiquorInfo {
  id: number;
  koName: string;
  koNameOrigin: string;
  enName: string;
  type: string;
  abv: string;
  volume: string;
  country: string;
  thumbnailImageUrl: string;
  tastingNotesAroma: string;
  tastingNotesTaste: string;
  tastingNotesFinish: string;
  region: string;
  grapeVariety: string;
  notesCount: number;
  price: string;
}

/** 주류 type: DB 버전 */
interface Liquor {
  id: number;
  koName: string | null;
  enName: string | null;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  thumbnailImageUrl: string | undefined;
  tastingNotesAroma: string | null;
  tastingNotesTaste: string | null;
  tastingNotesFinish: string | null;
  region: string | null;
  grapeVariety: string | null;
  // aiNotes: aiNotes | null;
  category: LiquorCategory | null;
  liquorAromas: Aroma[];
  user: User | null;
}

/** 사용자 type */
interface User {
  userUuid: string;
  profileNickname: string;
  profileThumbnailImage: string;
}

/** 노트 페이지네이션 type */
interface NoteList {
  cursor: number;
  eof: boolean;
  notes: Note[];
}

/** 노트 type */
interface Note {
  type: string;
  purchaseNote: PurchaseNote;
  tastingNote: TastingNote;
}

/** 노트 이미지 type */
interface NoteImage {
  id: number;
  fileName: string;
  fileUrl: string;
}

/** 구매 노트 type */
interface PurchaseNote {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  liquor: Liquor;
  noteImages: NoteImage[];
  purchaseAt: string;
  place: string;
  price: number;
  volume: number;
  content: string;
}

/** 감상 노트 type */
interface TastingNote {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  liquor: Liquor;
  noteImages: NoteImage[];
  tastingAt: string;
  method: string;
  place: string;
  noteAromas: Aroma[];
  score: number;
  isDetail: boolean;
  content: string;
  nose?: string;
  palate?: string;
  finish?: string;
}

/** 테이스팅노트 type: 주류 상세정보 페이지에서 보이는 유저 테이스팅 리뷰 목록 API 응답 객체 타입 */
interface TastingNoteList {
  id: number;
  liquor: Liquor;
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

/** 아로마 type */
interface Aroma {
  id: number;
  name: string;
}

/** 사용자 작성 노트 type: 주류별 작성 노트 그룹 정보 */
interface UserNoteGroup {
  liquor: Liquor;
  notesCount: number;
}

/** 사용자 작성 노트 목록 type */
interface UserNoteData {
  list: TastingNoteList[];
  group: UserNoteGroup[];
}

interface aiNotes {
  tastingNotesAroma: string;
  tastingNotesTaste: string;
  tastingNotesFinish: string;
}

// Props Types

/** KeyValueInfoComponent 호출 시 사용되는 props type */
interface KeyValueInfoProps {
  keyContent: string | null;
  valueContent: string | null;
  keyMinWidth: number;
}

/** SingleTastingComponent 호출 시 사용되는 props type */
interface SingleTastingProps {
  keyContent: string | null;
  valueContent: string | null;
  detailContent: string | null;
  keyMinWidth: number;
}

/** PostPage(테이스팅 노트 상세 페이지) 호출 시 사용되는 props type */
interface PostPageProps {
  params: { id: string };
}
