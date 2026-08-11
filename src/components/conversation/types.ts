export type ConversationAuthor = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
};

export type ConversationReaction = {
  emoji: string;
  count: number;
  reactedByMe: boolean;
};

export type ConversationReply = {
  id: string;
  body: string;
  author: ConversationAuthor;
  createdAt: string;
  reactions: ConversationReaction[];
};

export type ConversationMessage = {
  id: string;
  body: string;
  author: ConversationAuthor;
  createdAt: string;
  attachmentType: string | null;
  attachmentName: string | null;
  convertedTo: string | null;
  convertedRefId: string | null;
  pinned: boolean;
  reactions: ConversationReaction[];
  replies: ConversationReply[];
};
