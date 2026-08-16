export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  description: string[];
  tags?: string[];
};

export const education: TimelineItem[] = [
  {
    period: "2024 — 2028",
    title: "B.Tech, Computer Engineering",
    org: "Pimpri Chinchwad College of Engineering (PCCOE), Pune",
    description: [
      "Third-year student · CGPA 8.13 / 10.0",
      "Relevant coursework: Data Structures & Algorithms, DBMS, Computer Vision, OOP, Machine Learning, Computer Networks",
    ],
    tags: ["Software Development", "ML", "Computer Vision"],
  },
];

export const experience: TimelineItem[] = [
  {
    period: "1 Year",
    title: "Junior Engineer — Computer Vision",
    org: "Team Automatons, PCCOE (Robotics Team)",
    description: [
      "Trained a custom YOLO object detection pipeline — collecting datasets, annotating bounding boxes, and applying augmentation — achieving 90% detection accuracy over 200 epochs.",
      "Integrated OpenCV processing with Arduino & ESP32 microcontrollers for real-time target recognition, spatial mapping, and robotic arm actuation.",
      "Represented PCCOE at the International Rover Challenge (IRC) and ABU Robocon 2026.",
    ],
    tags: ["YOLO", "OpenCV", "Arduino", "ESP32", "Robotics"],
  },
  {
    period: "4 Months",
    title: "Content & Media Specialist",
    org: "PCCOE Research & Development (R&D) Club",
    description: [
      "Authored technical documentation and promotional content with student researchers to communicate department research initiatives across campus.",
    ],
    tags: ["Technical Writing", "Content"],
  },
];
