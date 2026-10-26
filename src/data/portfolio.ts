export type Kind = "Mobile" | "Cloud";

export type Project = {
  title: string;
  kind: Kind;
  summary: string;
  detail: string;
  stack: string[];
  href?: string;
};

export const profile = {
  name: "Samuel Ogundoju",
  also: "Dunamis",
  gender: "Male",
  date: "26 October 2026",
  place: "Lagos, Nigeria",
  github: "https://github.com/dunamislimitless",
  login: "dunamislimitless",
};

export const projects: Project[] = [
  {
    title: "Dr Marvis Chat",
    kind: "Mobile",
    summary: "A Flutter app for checking in on mental health.",
    detail:
      "Built with Dart. People open it to keep a simple check on how they are feeling. The source is public on GitHub.",
    stack: ["Flutter", "Dart"],
    href: "https://github.com/dunamislimitless/Dr-Marvis-Chat-AI",
  },
  {
    title: "E-commerce app",
    kind: "Mobile",
    summary: "A Flutter shop for browsing and buying goods.",
    detail:
      "A mobile storefront: look through products and move toward a purchase. Written in Flutter and Dart.",
    stack: ["Flutter", "Dart"],
    href: "https://github.com/dunamislimitless/E-commerce-App",
  },
  {
    title: "TSF Bank",
    kind: "Mobile",
    summary: "A small Flutter banking app for basic transfers.",
    detail:
      "A practice bank app that walks through a simple transfer. It is the mobile side of the same profile as the chat and shop apps.",
    stack: ["Flutter", "Dart"],
    href: "https://github.com/dunamislimitless/TSFBank-App",
  },
  {
    title: "Two-tier network",
    kind: "Cloud",
    summary: "A public bastion and a private instance in eu-north-1.",
    detail:
      "The VPC has a public subnet and a private subnet in one Availability Zone. SSH is allowed only from my own IP to the bastion, then only from the bastion security group to the private instance. The private key stays on my Mac, and the hop uses ProxyJump.",
    stack: ["Amazon VPC", "EC2", "Security groups"],
  },
  {
    title: "Cloud vendor API",
    kind: "Cloud",
    summary: "A Spring Boot service for cloud vendor records.",
    detail:
      "Java 17 and Spring Boot. The /cloudvendor routes create, read, update, and delete one vendor record.",
    stack: ["Java 17", "Spring Boot"],
    href: "https://github.com/dunamislimitless/rest-api-demo",
  },
];

export const skills = [
  "Flutter",
  "Dart",
  "Android",
  "iOS",
  "Amazon VPC",
  "EC2",
  "Security groups",
  "S3 static hosting",
  "SSH",
  "Java 17",
  "Spring Boot",
];
