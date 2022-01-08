// This file contains common types used through out the project.
import { Book, Post, Course, Dept } from '@prisma/client'

export type CourseWtihDept = Course & {
  dept: Dept
}

export type BookWithPostWithUserWithCourseWithDept = Book & {
  courses: CourseWtihDept[]
  posts: Post[]
}

export interface GoogleBook {
  title: string
  authors: string[]
  publisher: string
  publishedDate: string[]
  description: string
  industryIdentifiers: Object
  readingModes: Object
  pageCount: number
  printType: string
  categories: string[]
  averageRating: number
  ratingsCount: number
  maturityRating: string
  allowAnonLogging: boolean
  contentVersion: string
  imageLinks: Object
  language: string
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
}

export type PrismaWithGoogleBook = BookWithPostWithUserWithCourseWithDept & {
  googleBook: GoogleBook | Object
}

export interface googleBookItem {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: GoogleBook
  saleInfo: Object[]
  accessInfo: Object[]
  searchInfo: Object[]
}

export interface googleBookSearchResult {
  kind: string
  totalItems: number
  items: googleBookItem[]
}
