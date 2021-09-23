export interface INote {
  _id: string;
  heading: string;
  content: string;
  createdAt: Date;
  audioUrl: string;
  isAudio: boolean;
}
