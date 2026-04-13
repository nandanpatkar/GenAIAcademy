import { dsaPart1 } from "./dsa_part1";
import { dsaPart2 } from "./dsa_part2";
import { dsaPart3 } from "./dsa_part3";
import { dsaPart4 } from "./dsa_part4";
import { dsaPart5 } from "./dsa_part5";
import { dsaPart6 } from "./dsa_part6";
import { dsaPart7 } from "./dsa_part7";
import { dsaPart8 } from "./dsa_part8";
import { dsaPart9 } from "./dsa_part9";

export const DSA_PATH = {
  id: "pattern-wise-dsa",
  label: "DSA Mastery",
  title: "Pattern Wise DSA",
  subtitle: "Comprehensive algorithmic mastery mapping 450+ foundational patterns optimally.",
  description: "Master foundational to advanced data structures and algorithms via pattern-wise learning.",
  color: "#a855f7",
  dimColor: "#7c3aed",
  bgColor: "rgba(168,85,247,0.08)",
  borderColor: "rgba(168,85,247,0.3)",
  nodes: [
    ...dsaPart1,
    ...dsaPart2,
    ...dsaPart3,
    ...dsaPart4,
    ...dsaPart5,
    ...dsaPart6,
    ...dsaPart7,
    ...dsaPart8,
    ...dsaPart9
  ]
};
