import { Type, TypeKind } from "./module.ts";

export const DATABASE_SECTION_LABEL = "database";

export const NextApiRequestType: Type = {
  name: "NextApiRequest",
  kind: TypeKind.EXTERNAL,
  customRef: new URL(
    "https://github.com/vercel/next.js/blob/v12.0.4/packages/next/shared/lib/utils.ts#L227-L253"
  ),
};

export const NextApiResponseType: Type = {
  name: "NextApiResponse",
  kind: TypeKind.EXTERNAL,
  customRef: new URL(
    "https://github.com/vercel/next.js/blob/v12.0.4/packages/next/shared/lib/utils.ts#L260-L292"
  ),
};

export const BufferType: Type = {
  name: "Buffer",
  kind: TypeKind.EXTERNAL,
  customRef: new URL(
    "https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#class-buffer"
  ),
};

export const BlobType: Type = {
  name: "Blob",
  kind: TypeKind.EXTERNAL,
  customRef: new URL("https://nodejs.org/api/buffer.html#class-blob"),
};

export const DateType: Type = {
  name: "Date",
  kind: TypeKind.EXTERNAL,
  customRef: new URL(
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
  ),
};

export const PostType: Type = {
  name: "Post",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const CreatablePostType: Type = {
  name: "CreatablePost",
  kind: TypeKind.TUPLE,
  values: {
    price: "integer",
    description: "string",
    image: BufferType,
    bookId: "string",
  },
};

export const PostStatusType: Type = {
  name: "PostStatus",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const UpdatablePostType: Type = {
  name: "UpdatablePost",
  kind: TypeKind.TUPLE,
  values: {
    price: "integer",
    description: "string",
    image: BufferType,
    status: PostStatusType,
  },
};

export const BookType: Type = {
  name: "Book",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const CourseType: Type = {
  name: "Course",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const DeptType: Type = {
  name: "Dept",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const UserType: Type = {
  name: "User",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const SessionType: Type = {
  name: "Session",
  kind: TypeKind.EXTERNAL,
  customRef: DATABASE_SECTION_LABEL,
};

export const CourseWithBooksType: Type = {
  name: "CourseWithBooks",
  kind: TypeKind.UNION,
  types: [
    CourseType,
    {
      kind: TypeKind.TUPLE,
      values: { books: { kind: TypeKind.SEQUENCE, type: BookType } },
    },
  ],
};

export const SessionWithUserType: Type = {
  name: "SessionWithUser",
  kind: TypeKind.UNION,
  types: [
    SessionType,
    {
      kind: TypeKind.TUPLE,
      values: { user: UserType },
    },
  ],
};

export const PostWithUserType: Type = {
  name: "PostWithUser",
  kind: TypeKind.UNION,
  types: [
    PostType,
    {
      kind: TypeKind.TUPLE,
      values: { user: UserType },
    },
  ],
};

export const CourseWithDeptType: Type = {
  name: "CourseWithDept",
  kind: TypeKind.UNION,
  types: [
    CourseType,
    {
      kind: TypeKind.TUPLE,
      values: { dept: DeptType },
    },
  ],
};

export const TokenWithExpirationType: Type = {
  name: "TokenWithExpiration",
  kind: TypeKind.TUPLE,
  values: {
    token: "string",
    expirationDate: "Date",
  },
};

export const PopulatedBookType: Type = {
  name: "PopulatedBook",
  kind: TypeKind.UNION,
  types: [
    BookType,
    {
      kind: TypeKind.TUPLE,
      values: {
        courses: {
          kind: TypeKind.SET,
          values: new Set([CourseWithDeptType]),
        },
        googleBook: {
          kind: TypeKind.TUPLE,
          values: { "*": "*" },
        },
      },
    },
  ],
};

export const ModifiableUserType: Type = {
  name: "ModifiableUser",
  kind: TypeKind.TUPLE,
  values: {
    name: "string",
    imageUrl: "string",
  },
};

export const UserWithPostsType: Type = {
  name: "UserWithPosts",
  kind: TypeKind.UNION,
  types: [
    UserType,
    {
      kind: TypeKind.TUPLE,
      values: {
        posts: {
          kind: TypeKind.SET,
          values: new Set([PostType]),
        },
      },
    },
  ],
};

export const GoogleBookType: Type = {
  name: "GoogleBook",
  kind: TypeKind.EXTERNAL,
  customRef: new URL(
    "https://github.com/googleapis/google-api-nodejs-client/blob/01bf480d3e35354cc3fdc7d7aa2559611d459b50/src/apis/books/v1.ts#L1049"
  ),
};

export const CourseCodeType: Type = {
  name: "CourseCode",
  kind: TypeKind.TUPLE,
  values: {
    deptAbbreviation: "string",
    code: "string",
  },
};
