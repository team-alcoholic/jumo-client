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
