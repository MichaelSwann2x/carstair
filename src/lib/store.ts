export type UserRecord = {
  id: string;
  email: string;
  username: string;
  passwordHash?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  provider: "email" | "google";
  googleId?: string;
  tradingViewUsername?: string;
  tradingViewConnected?: boolean;
  redditUsername?: string;
  redditAccessToken?: string;
  createdAt: number;
};

export type UserModel = {
  id: string;
  userId: string;
  title: string;
  category: string;
  body: string;
  baseModelId?: string;
  updatedAt: number;
};

export type UserPaperNote = {
  id: string;
  userId: string;
  paperId: string;
  title: string;
  notes: string;
  updatedAt: number;
};

export type UserIndicator = {
  id: string;
  userId: string;
  name: string;
  /** Built-in TV study id e.g. STD;RSI or "custom" */
  studyId: string;
  script?: string;
  updatedAt: number;
};

export type BoardPost = {
  id: string;
  userId: string;
  username: string;
  kind: "idea" | "paper" | "model" | "chat";
  title: string;
  body: string;
  createdAt: number;
};

const g = globalThis as unknown as {
  __cs_users?: Map<string, UserRecord>;
  __cs_usernames?: Map<string, string>;
  __cs_models?: Map<string, UserModel[]>;
  __cs_papers?: Map<string, UserPaperNote[]>;
  __cs_indicators?: Map<string, UserIndicator[]>;
  __cs_board?: BoardPost[];
};

if (!g.__cs_users) g.__cs_users = new Map();
if (!g.__cs_usernames) g.__cs_usernames = new Map();
if (!g.__cs_models) g.__cs_models = new Map();
if (!g.__cs_papers) g.__cs_papers = new Map();
if (!g.__cs_indicators) g.__cs_indicators = new Map();
if (!g.__cs_board) g.__cs_board = [];

export const users = g.__cs_users;
export const usernames = g.__cs_usernames;
export const userModels = g.__cs_models;
export const userPapers = g.__cs_papers;
export const userIndicators = g.__cs_indicators;
export const board = g.__cs_board;

export function getUserModels(userId: string) {
  return userModels.get(userId) || [];
}
export function setUserModels(userId: string, list: UserModel[]) {
  userModels.set(userId, list);
}
export function getUserPapers(userId: string) {
  return userPapers.get(userId) || [];
}
export function setUserPapers(userId: string, list: UserPaperNote[]) {
  userPapers.set(userId, list);
}
export function getUserIndicators(userId: string) {
  return userIndicators.get(userId) || [];
}
export function setUserIndicators(userId: string, list: UserIndicator[]) {
  userIndicators.set(userId, list);
}
