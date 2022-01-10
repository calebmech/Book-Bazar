// This file contains common types used through out the project.
import { Book, Post, Course, Dept } from "@prisma/client";

export type CourseWithDept = Course & {
  dept: Dept;
};

export type BookWithPostWithUserWithCourseWithDept = Book & {
  courses: CourseWithDept[];
  posts: Post[];
};

export interface GoogleBook {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string[];
  description?: string;
  industryIdentifiers?: object;
  readingModes?: object;
  pageCount?: number;
  printType?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: object;
  imageLinks?: object;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink: string;
}

export type PopulatedBook = BookWithPostWithUserWithCourseWithDept & {
  googleBook: GoogleBook | null;
};

export interface GoogleBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: GoogleBook;
  saleInfo: object[];
  accessInfo: object[];
  searchInfo: object[];
}

export interface GoogleBookSearchResult {
  kind: string;
  totalItems: number;
  items: GoogleBookItem[];
}
