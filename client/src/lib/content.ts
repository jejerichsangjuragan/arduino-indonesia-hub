// Design note: Sirkuit Editorial — content models behave like modular editorial cards, with clear labels, technical metadata, and action-ready summaries.
export type Difficulty = "Pemula" | "Menengah" | "Mahir";

export type Tutorial = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  difficulty: Difficulty;
  duration: string;
  readTime: string;
  accent: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  level: Difficulty;
  parts: string;
  image: string;
  label: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tag: string;
  color: string;
};

export const tutorials: Tutorial[] = [
  { id: "t1", title: "Robot Hindari Halangan dengan HC-SR04", excerpt: "Buat robot pertama yang bisa membaca jarak, mengambil keputusan, dan berbelok otomatis.", category: "Robotika", difficulty: "Pemula", duration: "45 menit", readTime: "8 min", accent: "teal" },
  { id: "t2", title: "Kendalikan Servo dengan Potensiometer", excerpt: "Pahami PWM dan gerak presisi melalui eksperimen kecil yang mudah diulang.", category: "Motor Driver", difficulty: "Pemula", duration: "30 menit", readTime: "6 min", accent: "orange" },
  { id: "t3", title: "Dashboard Sensor Suhu Berbasis IoT", excerpt: "Kirim data sensor ke dashboard sederhana dan baca tren secara real-time.", category: "IoT", difficulty: "Menengah", duration: "90 menit", readTime: "12 min", accent: "blue" },
  { id: "t4", title: "PID Control untuk Line Follower", excerpt: "Naikkan level line follower dengan kontrol yang lebih halus dan responsif.", category: "Robotika", difficulty: "Mahir", duration: "120 menit", readTime: "18 min", accent: "graphite" },
];

export const projects: Project[] = [
  { id: "p1", title: "Robot Obstacle Avoider", description: "Robot eksplorasi pemula dengan sensor ultrasonik dan logika keputusan sederhana.", level: "Pemula", parts: "12 komponen", image: "/manus-storage/project-obstacle-avoider_b1301767.png", label: "BUILD 001" },
  { id: "p2", title: "Lengan Robot 4-DOF", description: "Lengan servo empat sumbu untuk belajar koordinasi gerak dan mekanika dasar.", level: "Menengah", parts: "28 komponen", image: "/manus-storage/project-robot-arm_e102f207.png", label: "BUILD 014" },
  { id: "p3", title: "Smart Home IoT", description: "Prototipe rumah mini yang memantau suhu, cahaya, dan relay dari satu dashboard.", level: "Mahir", parts: "19 komponen", image: "/manus-storage/project-smart-home_15c32f88.png", label: "BUILD 027" },
];

export const products: Product[] = [
  { id: "pr1", name: "Starter Kit Robotika", category: "Kit Robot", price: 349000, stock: 18, tag: "Paling dicari", color: "teal" },
  { id: "pr2", name: "Arduino Uno R3 Compatible", category: "Board", price: 89000, stock: 42, tag: "Best value", color: "orange" },
  { id: "pr3", name: "Sensor Ultrasonik HC-SR04", category: "Sensor", price: 24000, stock: 76, tag: "BOM essential", color: "blue" },
  { id: "pr4", name: "Micro Servo SG90", category: "Servo", price: 28000, stock: 31, tag: "Ready stock", color: "graphite" },
  { id: "pr5", name: "Chassis Robot 2WD", category: "Chassis", price: 76000, stock: 12, tag: "Build base", color: "teal" },
  { id: "pr6", name: "Motor Driver L298N", category: "Motor Driver", price: 39000, stock: 0, tag: "Pre-order", color: "orange" },
];

export const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export const sampleTutorialJson = {
  slug: "robot-obstacle-avoider",
  title: "Robot Hindari Halangan dengan HC-SR04",
  difficulty: "Pemula",
  bom: [{ name: "Arduino Uno", qty: 1 }, { name: "HC-SR04", qty: 1 }, { name: "Motor DC", qty: 2 }],
  schematic: "diagram://robot-obstacle-avoider-v1",
  code: "const int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n}\n\nvoid loop() {\n  long distance = readDistance();\n  if (distance < 20) turnRight();\n  else moveForward();\n}",
};
