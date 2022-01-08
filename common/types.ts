// This file contains common types used through out the project.

export interface book {
    id: string;
    isbn: string;
    name: string;
    imageUrl: string | null;
    googleBooksId: string | null;
    isCampusStoreBook: boolean;
    campusStorePrice: number | null;
    courses: course;
    posts : post;
    googleBook : googleBook | Object;
  };
  
  export interface course {
    id: string;
    name : string;
    code : string;
    term : string;
    year: number;
    deptId : string;
    dept: dept;
    books: book[];
  }
  
  export interface dept {
    id: string;
    name : string;
    abbreviation : string;
    courses: course;
  }
  
  export interface post {
    id: string;
    price: number;
    description: string;
    imageUrl: string | null;
    createdAt: Date;
    updateAt: Date;
    status: string;
    userId: string;
    user: user;
    bookId: string;
    book: book[];
  }
  
  export interface user {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    imageUrl: string;
    posts: post[];
    sessions: string;
  }

  export interface  googleBookSearchResult{
    kind: string;
    totalItems: number;
    items: googleBookItem[];
  }
  
  export interface googleBookItem {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: googleBook;
    saleInfo: Object[];
    accessInfo: Object[];
    searchInfo: Object[];
  }
  
  export interface googleBook {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string[];
    description: string;
    industryIdentifiers : Object;
    readingModes: Object;
    pageCount: number;
    printType: string;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    imageLinks : Object;
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  }