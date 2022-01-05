import { AnticipatedChange } from "./anticipated-changes.ts";
import { Module, ModuleType, TypeKind } from "./module.ts";
import {
  generateSwaggerHref,
  moduleReference,
  npmLink,
} from "./spec-helpers.ts";
import {
  PopulatedBookType,
  CourseWithBooksType,
  CreatablePostType,
  ModifiableUserType,
  NextApiRequestType,
  NextApiResponseType,
  PostType,
  PostWithUserType,
  SessionType,
  SessionWithUserType,
  TokenWithExpirationType,
  UpdatablePostType,
  UserType,
  UserWithPostsType,
  DateType,
  BufferType,
} from "./types.ts";

export enum Implementer {
  BOOK_BAZAR = "Book Bazar",
  OS = "OS",
}

export enum FR {
  FR1 = "FR1",
  FR2 = "FR2",
  FR3 = "FR3",
  FR4 = "FR4",
  FR5 = "FR5",
  FR6 = "FR6",
  FR7 = "FR7",
  FR8 = "FR8",
  FR9 = "FR9",
  FR10 = "FR10",
  FR11 = "FR11",
  FR12 = "FR12",
  FR13 = "FR13",
  FR14 = "FR14",
}

// Imported modules

const PrismaClientModule: Module = {
  name: "Prisma Client",
  codeName: "PrismaClient",
  secrets: "How to read from and write to the database",
  services:
    "Provides the ability to retrieve and modify information stored in a database",
  implementedBy: npmLink("@prisma/client"),
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [],
  associatedRequirements: [],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    "\\url{https://www.prisma.io/docs/reference/api-reference/prisma-client-reference}",
  ].join("\n"),
};

const AwsSdkModule: Module = {
  name: "AWS SDK",
  codeName: "AwsSdk",
  secrets: "How to interact with Amazon Web Services (AWS)",
  services:
    "Provides the ability to use and manage AWS services. This project is mainly interested in the \\href{https://aws.amazon.com/s3/}{S3} API",
  implementedBy: npmLink("aws-sdk"),
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [],
  associatedRequirements: [],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    "\\url{https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html}",
  ].join("\n"),
};

const SendgridMailModule: Module = {
  name: "Sendgrid Mail",
  codeName: "SgMail",
  secrets: "How to interact with the Sendgrid service",
  services:
    "Provides the send emails with the \\href{https://sendgrid.com/solutions/email-api/}{Sendgrid email API}",
  implementedBy: npmLink("@sendgrid/mail"),
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [],
  associatedRequirements: [],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    "\\url{https://docs.sendgrid.com/api-reference}",
  ].join("\n"),
};

const AlgoliaSearchModule: Module = {
  name: "Algolia Search",
  codeName: "Algolia",
  secrets: "How to interact with the Algolia search service",
  services:
    "Provides method to index and search for courses and books in Algolia",
  implementedBy: npmLink("algoliasearch"),
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [],
  associatedRequirements: [],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    "\\url{https://www.algolia.com/doc/api-client/getting-started/what-is-the-api-client/javascript}",
  ].join("\n"),
};

const GoogleBooksSearchModule: Module = {
  name: "Google Books Search",
  codeName: "GoogleBooksSearch",
  secrets: "How to interact with the Google Books search service",
  services:
    "Provides method to search for and retrieve books from Google Books",
  implementedBy: npmLink("google-books-search"),
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [],
  associatedRequirements: [],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    "\\url{https://github.com/smilledge/node-google-books-search}",
  ].join("\n"),
};

// Software Decision modules

const EnvironmentModule: Module = {
  name: "Environment",
  codeName: "Environment",
  path: "/lib/helpers/backend/env.ts",
  secrets: "Environment variable constants",
  services: "Provides various environment variable constants",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.SOFTWARE_DECISION,
  uses: [],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedConstants: [
        {
          name: "BASE\\_URL",
          type: "string",
          description:
            "URL that Book Bazar is currently hosted at (e.g. bookbazar.me)",
        },
        {
          name: "AWS\\_API\\_KEY",
          type: "string",
          description: "API key used to connect to AWS services",
        },
        {
          name: "SENDGRID\\_API\\_KEY",
          type: "string",
          description: "API key used to connect to the Sendgrid service",
        },
        {
          name: "SENDGRID\\_EMAIL\\_FROM",
          type: "string",
          description: "Email address to send Sendgrid emails from",
        },
        {
          name: "IS\\_E2E",
          type: "boolean",
          description:
            "Whether Book Bazar is currently being run in end-to-end testing mode",
        },
      ],
    },
    semantics: {
      assumptions: [
        "An exception will be thrown if any exported constant cannot be initialized to a valid value",
      ],
    },
  },
};

const SessionCookieModule: Module = {
  name: "Session Cookie",
  codeName: "SessionCookie",
  path: "/lib/helpers/backend/session-cookie.ts",
  secrets: "How to create and delete session cookies",
  services: "Provides methods to create and delete HTTP session cookies",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.SOFTWARE_DECISION,
  uses: [EnvironmentModule],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedConstants: [
        {
          name: "SESSION\\_TOKEN\\_COOKIE",
          type: "string",
          description: "Key of cookie used to store session token",
        },
      ],
      exportedAccessPrograms: [
        {
          name: "createSessionCookie",
          in: {
            sessionToken: "string",
            expirationDate: DateType,
          },
          out: "string",
          semantics: [
            "Creates a cookie at SESSION\\_TOKEN\\_COOKIE that contains the passed sessionToken and expires at expirationDate",
          ],
        },
        {
          name: "createDeleteSessionCookie",
          in: {},
          out: "string",
          semantics: [
            "Creates a cookie that, when set, deletes the session token cookie from a users browser",
          ],
        },
      ],
    },
    semantics: {},
  },
};

const TokensModule: Module = {
  name: "Tokens",
  codeName: "Tokens",
  path: "/lib/helpers/backend/tokens.ts",
  secrets: "How to tokens are created and hashed",
  services:
    "Provides methods to create and hash cryptographically secure and random tokens",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.SOFTWARE_DECISION,
  uses: [],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "createToken",
          in: {},
          out: ["string"],
          semantics: [
            "Creates a cryptographically random \\href{https://en.wikipedia.org/wiki/Universally_unique_identifier}{universally unique identifier}",
          ],
        },
        {
          name: "hashToken",
          in: {
            token: "string",
          },
          out: "string",
          semantics: ["Irreversibly hashes a token"],
        },
      ],
    },
    semantics: {},
  },
};

// Service Modules

const ImageServiceModule: Module = {
  name: "Image Service",
  codeName: "ImageService",
  path: "/lib/services/image.ts",
  secrets: "How to store an image",
  services:
    "Provides method to store an image in cloud storage for retrieval with a URL",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [AwsSdkModule, EnvironmentModule],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "upload",
          in: {
            file: BufferType,
          },
          out: "string",
          semantics: [
            "Format image so that it can be stored",
            "Upload image to cloud storage",
            "return a publicly-accessible permalink to the uploaded image",
          ],
        },
        {
          name: "delete",
          in: {
            url: "string",
          },
          semantics: ["Delete image from cloud storage"],
        },
      ],
    },
    semantics: {},
  },
};

const PostServiceModule: Module = {
  name: "Post Service",
  codeName: "PostService",
  path: "/lib/services/post.ts",
  secrets: "How to get and modify post information",
  services:
    "Provides the ability to retrieve and modify stored post information",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PrismaClientModule, ImageServiceModule],
  associatedRequirements: [FR.FR1, FR.FR2, FR.FR3],
  contents: {
    syntax: {
      exportedTypes: [PostWithUserType, CreatablePostType, UpdatablePostType],
      exportedAccessPrograms: [
        {
          name: "getPost",
          in: {
            id: "string",
            includeUser: "boolean",
          },
          out: [PostType, PostWithUserType, "null"],
          semantics: [
            "Gets a post from the database by ID and populates the post with the corresponding user",
            "The user is only populated if includeUser is true",
          ],
        },
        {
          name: "createPost",
          in: {
            post: CreatablePostType,
          },
          out: [PostType],
          semantics: [
            "Create a new post in the database",
            `Uploads the textbook picture using ${moduleReference(ImageServiceModule)} if one is provided`,
          ],
        },
        {
          name: "updatePost",
          in: {
            id: "string",
            post: UpdatablePostType,
          },
          out: [PostType],
          semantics: [
            "Updates a post in the database",
            `Uploads the new textbook picture using ${moduleReference(ImageServiceModule)} if a new one is provided`,
            `Deletes the old textbook picture using ${moduleReference(ImageServiceModule)} if a new one is provided`,
          ],
        },
        {
          name: "deletePost",
          in: {
            id: "string",
          },
          semantics: [
            "Deletes a post from the database",
            `Deletes post image using ${moduleReference(ImageServiceModule)}`,
          ],
        },
      ],
    },
    semantics: {
      assumptions: [
        "The exported access programs are only used if the calling user is authorized to use them",
        "Inputs to exported access programs have been validated by the caller",
      ],
    },
  },
};

const BookServiceModule: Module = {
  name: "Book Service",
  codeName: "BookService",
  path: "/lib/services/book.ts",
  secrets: "How to get book information",
  services: "Provides the ability to retrieve stored book information",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PrismaClientModule, GoogleBooksSearchModule],
  associatedRequirements: [FR.FR4, FR.FR6, FR.FR10],
  contents: {
    syntax: {
      exportedTypes: [PopulatedBookType],
      exportedAccessPrograms: [
        {
          name: "getPopulatedBook",
          in: {
            isbn: "string",
            includeUsers: "boolean",
            postsLength: "integer",
            postsPage: "integer",
          },
          out: [PopulatedBookType],
          semantics: [
            `Gets a book from the database by ISBN and populates its posts,` +
              ` courses, and Google books data (using ${moduleReference(
                GoogleBooksSearchModule
              )})`,
            "The number of posts to return is determined by postsLength",
            "The offset of posts to return is determined by postsPage",
            "The user tuples inside posts are only populated if includeUsers is true",
          ],
        },
      ],
    },
    semantics: {
      assumptions: [
        "The exported access programs are only used if the calling user is authorized to use them",
        "Inputs to exported access programs have been validated by the caller",
      ],
    },
  },
};

const CourseServiceModule: Module = {
  name: "Course Service",
  codeName: "CourseService",
  path: "/lib/services/user.ts",
  secrets: "How to get course information",
  services:
    "Provides the ability to retrieve courses and their related information",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PrismaClientModule],
  associatedRequirements: [FR.FR5],
  contents: {
    syntax: {
      exportedTypes: [CourseWithBooksType],
      exportedAccessPrograms: [
        {
          name: "getCourseWithBooks",
          in: { id: "string" },
          out: CourseWithBooksType,
          semantics: [
            "Gets a course by ID and populates the books for that course",
          ],
        },
        {
          name: "getPostsForCourse",
          in: {
            id: "string",
            length: "integer",
            page: "integer",
            includeUser: "boolean",
          },
          out: [
            { kind: TypeKind.SEQUENCE, type: PostType },
            { kind: TypeKind.SEQUENCE, type: PostWithUserType },
          ],
          semantics: [
            "Get posts for a course ID",
            "The number of posts to return is determined by length",
            "The offset of posts to return is determined by page",
            "The user in posts is only populated if includeUser is true",
          ],
        },
      ],
    },
    semantics: {
      assumptions: [
        "The exported access programs are only used if the calling user is authorized to use them",
        "Inputs to exported access programs have been validated by the caller",
        "The number of books for a course will not grow to an unmanageable amount (e.g. $> 10$)",
      ],
    },
  },
};

const CampusStoreScrapperModule: Module = {
  name: "Campus Store Scrapper",
  codeName: "CampusStoreScrapper",
  path: "/lib/campus-store-scrapper.ts",
  secrets: "How to index the campus store textbook library",
  services:
    "Provides the ability to retrieve and store textbook and course information from the campus store",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [AlgoliaSearchModule, GoogleBooksSearchModule, PrismaClientModule],
  associatedRequirements: [FR.FR4, FR.FR10],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "indexTextbooks",
          in: {},
          semantics: [
            "To be run on a schedule once per week",
            "Get all textbooks from campus book store",
            `Get Google books ID for each textbook using ${moduleReference(
              GoogleBooksSearchModule
            )}`,
            "Update or create found book, course, and department entries in database",
            "Update Algolia index to match database",
          ],
        },
      ],
    },
    semantics: {},
  },
};

const UserServiceModule: Module = {
  name: "User Service",
  codeName: "UserService",
  path: "/lib/services/user.ts",
  secrets: "How to get and modify user information",
  services:
    "Provides the ability to retrieve and modify stored user information",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PrismaClientModule, ImageServiceModule],
  associatedRequirements: [FR.FR9, FR.FR11, FR.FR12],
  contents: {
    syntax: {
      exportedTypes: [ModifiableUserType, UserWithPostsType],
      exportedAccessPrograms: [
        {
          name: "findOrCreateUser",
          in: { email: "string" },
          out: UserType,
          semantics: [
            "Finds an existing user in the database by email or creates ones if none is found",
          ],
        },
        {
          name: "getUserWithPosts",
          in: { id: "string" },
          out: UserWithPostsType,
          semantics: [
            "Gets a user from the database by ID and populates the user with their posts",
          ],
        },
        {
          name: "updateUser",
          in: { id: "string", updatedUser: ModifiableUserType },
          out: UserType,
          semantics: [
            "Updates a user in the database by ID using the given object",
          ],
        },
        {
          name: "deleteUser",
          in: { id: "string" },
          out: UserType,
          semantics: [
            "Deletes a user from the database by ID",
            `Deletes user image using ${moduleReference(ImageServiceModule)}`,
          ],
        },
      ],
    },
    semantics: {
      assumptions: [
        "The exported access programs are only used if the calling user is authorized to use them",
        "Inputs to exported access programs have been validated by the caller",
      ],
    },
  },
};

const SessionServiceModule: Module = {
  name: "Session Service",
  codeName: "SessionService",
  path: "/lib/services/session.ts",
  secrets: "How to get and modify session information",
  services:
    "Provides the ability to retrieve and modify stored session information",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PrismaClientModule, TokensModule],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedTypes: [SessionWithUserType],
      exportedAccessPrograms: [
        {
          name: "getSessionWithUser",
          in: { sessionToken: "string" },
          out: [SessionWithUserType, "null"],
          semantics: [
            "Finds session with hashed version of passed token",
            "If no session exists, return null",
            "If session is expired, delete it from database and return null",
            "If session will expire within a month, refresh token expiration date",
            "Return most recent version of the session",
          ],
        },
        {
          name: "createSession",
          in: { sessionToken: "string", userId: "string" },
          out: SessionType,
          semantics: [
            "Creates a session in the database using a hashed version of the passed token" +
              "and an expiration date of six months from the current time for the passed user ID",
          ],
        },
        {
          name: "deleteSession",
          in: { sessionToken: "string" },
          out: [],
          semantics: ["Deletes session matching passed token from database"],
        },
      ],
    },
    semantics: {},
  },
};

const MagicLinkServiceModule: Module = {
  name: "Magic Link Service",
  codeName: "MagicLinkService",
  path: "/lib/services/magic.ts",
  secrets: "How to send and consume magic links",
  services:
    "Provides the ability to send magic link emails and consume them to create a new session",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [
    PrismaClientModule,
    SendgridMailModule,
    UserServiceModule,
    SessionServiceModule,
    TokensModule,
    EnvironmentModule,
  ],
  associatedRequirements: [FR.FR11],
  contents: {
    syntax: {
      exportedTypes: [TokenWithExpirationType],
      exportedAccessPrograms: [
        {
          name: "sendMagicLink",
          in: {
            email: "string",
          },
          out: [],
          semantics: [
            "Creates a new verification email database entry that expires one hour from the current time",
            "Sends a email with a login link to \\texttt{/magic?token=VERIFICATION\\_TOKEN} to the specified email",
          ],
        },
        {
          name: "consumeMagicLink",
          in: {
            verificationToken: "string",
          },
          out: [TokenWithExpirationType, "null"],
          semantics: [
            "Deletes new verification email database entry (so that it is only used once)",
            "If verification email has not expired, return null",
            `Find existing user with email or create one if it does not exist using ${moduleReference(
              UserServiceModule
            )}`,
            `Create a new session using ${moduleReference(
              SessionServiceModule
            )}`,
            `Return created session and related un-hashed token`,
          ],
        },
      ],
    },
    semantics: {
      assumptions: ["All passed emails are valid McMaster emails"],
    },
  },
};

const UserHelpersModule: Module = {
  name: "User Helpers",
  codeName: "UserHelpers",
  path: "/lib/helpers/backend/user-helpers.ts",
  secrets: "How to interact with user data",
  services: "Provides methods to perform common tasks with user objects",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.SOFTWARE_DECISION,
  uses: [UserServiceModule, SessionServiceModule, SessionCookieModule],
  associatedRequirements: [],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "getCurrentUser",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          out: [UserType, "null"],
          semantics: [
            "Gets and returns currently logged in user",
            "Refreshes session token cookie with latest value",
          ],
        },
        {
          name: "isAuthenticated",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          out: "boolean",
          semantics: [
            "Returns true if getCurrentUser returns a user tuple and false if null is returned",
          ],
        },
        {
          name: "isUserProfileCompleted",
          in: { user: UserType },
          out: "boolean",
          semantics: ["Returns true if user name has a value"],
        },
      ],
    },
    semantics: {},
  },
};

// HTTP Handlers

const PostHttpHandlerModule: Module = {
  name: "Post HTTP Handler",
  codeName: "PostHttpHandler",
  path: "/pages/api/post",
  secrets: "How to respond to REST API requests for posts",
  services: "Provides the ability to create, get, update, and delete posts",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [PostServiceModule, ImageServiceModule, UserHelpersModule],
  associatedRequirements: [FR.FR1, FR.FR2, FR.FR3, FR.FR9],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "handler",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          semantics: [
            "Implements OpenAPI spec defined at " + generateSwaggerHref("Post"),
          ],
        },
      ],
    },
    semantics: {},
  },
};

const BookHttpHandlerModule: Module = {
  name: "Book HTTP Handler",
  codeName: "BookHttpHandler",
  path: "/pages/api/book",
  secrets: "How to respond to REST API requests for books",
  services:
    "Provides the ability to get information for a book, including posts for it",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [BookServiceModule, UserHelpersModule],
  associatedRequirements: [FR.FR6, FR.FR9, FR.FR10],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "handler",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          semantics: [
            "Implements OpenAPI spec defined at " + generateSwaggerHref("Book"),
          ],
        },
      ],
    },
    semantics: {},
  },
};

const CourseHttpHandlerModule: Module = {
  name: "Course HTTP Handler",
  codeName: "CourseHttpHandler",
  path: "/pages/api/course",
  secrets: "How to respond to REST API requests for courses",
  services:
    "Provides the ability to get information for a course, including books and posts for it",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [CourseServiceModule, UserHelpersModule],
  associatedRequirements: [FR.FR5, FR.FR9],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "handler",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          semantics: [
            "Implements OpenAPI spec defined at " +
              generateSwaggerHref("Course"),
          ],
        },
      ],
    },
    semantics: {},
  },
};

const AuthHttpHandlerModule: Module = {
  name: "Auth HTTP Handler",
  codeName: "AuthHttpHandler",
  path: "/pages/api/auth",
  secrets: "How to respond to REST API requests for authentication",
  services:
    "Provides the ability to create users, authenticate them, and logout",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [MagicLinkServiceModule, SessionServiceModule, UserHelpersModule],
  associatedRequirements: [FR.FR9, FR.FR11],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "handler",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          semantics: [
            "Implements OpenAPI spec defined at " + generateSwaggerHref("Auth"),
          ],
        },
      ],
    },
    semantics: {},
  },
};

const UserHttpHandlerModule: Module = {
  name: "User HTTP Handler",
  codeName: "UserHttpHandler",
  path: "/pages/api/user",
  secrets: "How to respond to REST API requests for users",
  services: "Provides the ability to get, update, and delete users",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [UserServiceModule, ImageServiceModule, UserHelpersModule],
  associatedRequirements: [FR.FR9, FR.FR8, FR.FR12, FR.FR14],
  contents: {
    syntax: {
      exportedAccessPrograms: [
        {
          name: "handler",
          in: {
            req: NextApiRequestType,
            res: NextApiResponseType,
          },
          semantics: [
            "Implements OpenAPI spec defined at " + generateSwaggerHref("User"),
          ],
        },
      ],
    },
    semantics: {},
  },
};

const UserInterfaceModule: Module = {
  name: "User Interface",
  codeName: "UserInterface",
  path: "/pages",
  secrets:
    "How to allow users to go through the process of buying and selling textbooks",
  services: "Provides the user interface of the application",
  implementedBy: Implementer.BOOK_BAZAR,
  type: ModuleType.BEHAVIOUR_HIDING,
  uses: [AlgoliaSearchModule],
  associatedRequirements: [
    FR.FR1,
    FR.FR2,
    FR.FR3,
    FR.FR4,
    FR.FR5,
    FR.FR6,
    FR.FR7,
    FR.FR8,
    FR.FR9,
    FR.FR10,
    FR.FR11,
    FR.FR12,
    FR.FR13,
    FR.FR14,
  ],
  contents: [
    "\\subsection*{Syntax \\& Semantics}",
    `Implements user interface defined at \\url{https://www.figma.com/file/FS5U5ssCSPctWH41VhGIsn/Book-Bazar} and by UML state diagram below:\n`,
    "\\begin{figure}[H]",
    "\\centering",
    `\\includegraphics[width=1\\textwidth]{UIStateDiagram}`,
    "\\caption{User Interface UML state diagram}",
    "\\end{figure}",
  ].join("\n"),
};
export interface NumberedModule extends Module {
  moduleNumber: string;
}

export const modules = [
  UserInterfaceModule,
  PostHttpHandlerModule,
  BookHttpHandlerModule,
  CourseHttpHandlerModule,
  AuthHttpHandlerModule,
  UserHttpHandlerModule,
  UserServiceModule,
  CourseServiceModule,
  PostServiceModule,
  BookServiceModule,
  SessionServiceModule,
  MagicLinkServiceModule,
  ImageServiceModule,
  CampusStoreScrapperModule,
  PrismaClientModule,
  AwsSdkModule,
  SendgridMailModule,
  AlgoliaSearchModule,
  GoogleBooksSearchModule,
  TokensModule,
  EnvironmentModule,
  SessionCookieModule,
  UserHelpersModule,
].map((module, i) => ({
  moduleNumber: "M" + (i + 1),
  ...module,
}));

function getNumberedModules(mds: Module[]): NumberedModule[] {
  return modules.filter((md) =>
    mds.map((m) => m.codeName).includes(md.codeName)
  );
}

export const likelyChanges: AnticipatedChange[] = [
  {
    change:
      "The frontend design for the application will change as more feedback about it's usability is received",
    relatedModules: getNumberedModules([UserInterfaceModule]),
  },
  {
    change:
      "The authentication system will be updated to make magic links sent to user emails more simple and secure to handle",
    relatedModules: getNumberedModules([
      AuthHttpHandlerModule,
      MagicLinkServiceModule,
      SessionServiceModule,
    ]),
  },
  {
    change:
      "The campus book store scraper will be updated if the campus store website source code change",
    relatedModules: getNumberedModules([CampusStoreScrapperModule]),
  },
  {
    change:
      "Calls to the Google Books API will be updated according to API or data changes",
    relatedModules: getNumberedModules([GoogleBooksSearchModule]),
  },
  {
    change:
      "Calls to the Algolia API will be updated according to API or data changes",
    relatedModules: getNumberedModules([AlgoliaSearchModule]),
  },
  {
    change:
      "Calls to the Sendgrid API will be updated according to API or data changes",
    relatedModules: getNumberedModules([SendgridMailModule]),
  },
  {
    change:
      "The image cloud storage provider will be changed based on system needs",
    relatedModules: getNumberedModules([ImageServiceModule]),
  },
];

export const unlikelyChanges: AnticipatedChange[] = [
  {
    change:
      "Input/Output devices (Input: Keyboard, Mouse Click, Output: Memory and/or Screen)",
    relatedModules: [],
  },
  {
    change:
      "It is unlikely that a React framework besides Next.js will be used for the application",
    relatedModules: [],
  },
  {
    change:
      "Vercel will always be used for the serverless deployment of the application",
    relatedModules: [],
  },
  {
    change: "Browsers that the application will support are unlikely to change",
    relatedModules: [],
  },
];
