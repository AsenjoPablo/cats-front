import { atom } from "recoil";

export const favAtom = atom<string[]>({
  key: "fav",
  default: [],
});
