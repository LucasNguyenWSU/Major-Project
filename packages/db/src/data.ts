export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const posts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2022"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 320,
    likes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2020"),
    category: "React",
    tags: "Front-End,Optimisation",
    views: 10,
    likes: 1,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("Dec 16, 2024"),
    category: "React",
    tags: "Front-End,Dev Tools",
    views: 22,
    likes: 2,
    active: true,
  },
  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    date: new Date("Dec 16, 2012"),
    category: "React",
    tags: "Programming,Mainframes",
    views: 22,
    likes: 1,
    active: false,
  },
  {
    id: 5,
    title: "Mastering TypeScript Advanced Patterns",
    urlId: "mastering-typescript-advanced-patterns",
    description,
    content: content + " ... post5",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Jan 10, 2024"),
    category: "Node",
    tags: "TypeScript,Back-End",
    views: 156,
    likes: 5,
    active: true,
  },
  {
    id: 6,
    title: "React Hooks Deep Dive",
    urlId: "react-hooks-deep-dive",
    description,
    content: content + " ... post6",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Feb 15, 2024"),
    category: "React",
    tags: "Front-End,JavaScript",
    views: 243,
    likes: 8,
    active: true,
  },
  {
    id: 7,
    title: "Database Optimization Techniques",
    urlId: "database-optimization-techniques",
    description,
    content: content + " ... post7",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Mar 20, 2024"),
    category: "Node",
    tags: "Databases,Performance",
    views: 178,
    likes: 4,
    active: true,
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox",
    urlId: "css-grid-vs-flexbox",
    description,
    content: content + " ... post8",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 05, 2024"),
    category: "React",
    tags: "Front-End,CSS",
    views: 421,
    likes: 12,
    active: true,
  },
  {
    id: 9,
    title: "Prisma ORM Best Practices",
    urlId: "prisma-orm-best-practices",
    description,
    content: content + " ... post9",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("May 10, 2024"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 267,
    likes: 6,
    active: true,
  },
  {
    id: 10,
    title: "Next.js App Router Migration",
    urlId: "nextjs-app-router-migration",
    description,
    content: content + " ... post10",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("May 25, 2024"),
    category: "React",
    tags: "Front-End,Next.js",
    views: 334,
    likes: 9,
    active: true,
  },
  {
    id: 11,
    title: "API Design Principles",
    urlId: "api-design-principles",
    description,
    content: content + " ... post11",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("June 01, 2024"),
    category: "Node",
    tags: "Back-End,REST",
    views: 298,
    likes: 7,
    active: true,
  },
  {
    id: 12,
    title: "Testing React Components",
    urlId: "testing-react-components",
    description,
    content: content + " ... post12",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("June 15, 2024"),
    category: "React",
    tags: "Front-End,Testing",
    views: 445,
    likes: 11,
    active: true,
  },
];
