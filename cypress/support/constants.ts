import { Course, Dept, Prisma, User } from ".prisma/client";

export const TEST_USER_UUID = "e8b7ad6d-7086-4d8d-b831-079d5be7caa8";
export const TEST_USER: Partial<User> = {
  email: "test@mcmaster.ca",
  name: "Test User",
  imageUrl: "https://book-bazar-images.s3.us-east-2.amazonaws.com",
  id: TEST_USER_UUID,
};
export const TEST_POST_UUID = "a510b3dd-1ffb-4fdb-b2d3-9b8e3c4c0f63";
export const TEST_OTHER_PERSON_POST_UUID =
  "230beb00-48e8-4e93-8b20-da77e69dc5cb";

export const TEST_POST_1_UUID = "60f8de7d-9362-42fe-a9c9-fc9e4af28aae";
export const TEST_POST_2_UUID = "68b94647-b3d3-4ed7-90a3-e25c1abe8a07";

export const TEST_BOOK_1_ISBN = "9780321573513";
export const TEST_BOOK_2_ISBN = "281000000877B";

export const TEST_DEPARTMENT_UUID = "40237be4-cfee-4648-8420-d90e1ed3e6eb";
export const TEST_DEPARTMENT: Dept = {
  id: TEST_DEPARTMENT_UUID,
  name: "Computer Science",
  abbreviation: "COMPSCI",
};

export const TEST_COURSE_UUID = "d6e59eb0-dcb8-49f6-b6b7-23798b1fafff";
export const TEST_COURSE: Course = {
  id: TEST_COURSE_UUID,
  name: "Algorithms and Complexity",
  code: "3AC3",
  term: "Winter 2022",
  deptId: TEST_DEPARTMENT_UUID,
};

export const TEST_BOOK_UUID = "a176ef48-56cc-4fc5-bf9e-7b40e3e8e884";
export const TEST_BOOK = {
  courses: {
    connect: {
      id: TEST_COURSE_UUID,
    },
  },
  id: TEST_BOOK_UUID,
  isbn: TEST_BOOK_1_ISBN,
  name: "Algorithms",
  imageUrl:
    "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
  campusStorePrice: 4000,
  isCampusStoreBook: true,
};

export const TEST_POSTS: Prisma.PostCreateManyInput[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
].map((price) => {
  return {
    bookId: TEST_BOOK_UUID,
    userId: TEST_USER_UUID,
    description: "TEST POST " + price,
    price: price,
    imageUrl:
      "https://book-bazar-images.s3.us-east-2.amazonaws.com/77498c29-6771-4786-a5b7-fcfeea506d11",
  };
});
export const ALGOLIA_RESPONSE_5_RESULTS = {
  results: [
    {
      hits: [
        {
          type: "course",
          entry: {
            id: "4fdec9ec-a781-452a-bb36-59a2a9b3c4e8",
            name: "Introduction to Anthropology: Sex, Food and Death",
            code: "1AA3",
            term: "Winter 2022",
            deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
            dept: {
              id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
              name: "Anthropology",
              abbreviation: "ANTHROP",
            },
          },
          objectID: "602817002",
          _highlightResult: {
            entry: {
              name: {
                value:
                  "Introduction to Anthropology: Sex, __aa-highlight__Food__/aa-highlight__ and Death",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
              code: {
                value: "1AA3",
                matchLevel: "none",
                matchedWords: [],
              },
              dept: {
                name: {
                  value: "Anthropology",
                  matchLevel: "none",
                  matchedWords: [],
                },
                abbreviation: {
                  value: "ANTHROP",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
            },
          },
        },
        {
          type: "course",
          entry: {
            id: "e8ca93fd-b38a-476f-8363-2b5a54223a42",
            name: null,
            code: "4CC3",
            term: "Winter 2022",
            deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
            dept: {
              id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
              name: "Anthropology",
              abbreviation: "ANTHROP",
            },
          },
          objectID: "602829002",
          _highlightResult: {
            entry: {
              name: {
                value:
                  "Archaeology of __aa-highlight__Food__/aa-highlight__ways",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
              code: {
                value: "4CC3",
                matchLevel: "none",
                matchedWords: [],
              },
              dept: {
                name: {
                  value: "Anthropology",
                  matchLevel: "none",
                  matchedWords: [],
                },
                abbreviation: {
                  value: "ANTHROP",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
            },
          },
        },
        {
          type: "book",
          entry: {
            id: "20897d23-8e12-4d4e-8bb5-42a29e2cef4b",
            isbn: "9780874772098",
            name: "CHOP WOOD CARRY WATER",
            imageUrl:
              "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9780874772098",
            isCampusStoreBook: true,
            campusStorePrice: 2000,
            courses: [
              {
                id: "2ba4f9a2-c417-465d-9a1c-15209fcde680",
                name: "Inquiry III: Advanced Inquiry in Health Sciences",
                code: "3E03",
                term: "Winter 2022",
                deptId: "241804ef-6fd0-4078-8d81-566b12f6b898",
                dept: {
                  id: "241804ef-6fd0-4078-8d81-566b12f6b898",
                  name: "Health Sciences",
                  abbreviation: "HTHSCI",
                },
              },
            ],
            googleBook: {
              title: "Chop Wood, Carry Water",
              subtitle:
                "A Guide to Finding Spiritual Fulfillment in Everyday Life",
              authors: ["Rick Fields"],
              publisher: "Penguin",
              publishedDate: "1984-12-01",
              description:
                "More than a thousand years ago a Chinese Zen Master wrote: Magical Power, Marvelous Action! Chopping Wood, Carrying Water... The message is as true today as it was then: the greatest lessons and the profoundest heights of the spiritual path can be found in our everyday life. It is the greatest challenge for people living in contemporary society to find the spiritual aspects of working in an office, store, or factory; balancing a checkbook; raising a family; or making a relationship work. How can we make all these daily activities a part of the path? How can we apply the insights of great spiritual traditions, and our own experience, to the way we live and develop? This book is a guide - a handbook filled with information, advice, hints, stories, inspiration, encouragement, connections, warning, and cautions, for the inner journey as we live throughout our lives. Chop Wood, Carry Water contains much ancient wisdom, but the emphasis is on contemporary perceptions. Many of our guides have been known to humanity for millennia: they are the world's great spiritual teachers- Christ, the Buddha, Loa Tse, Confucius. Others are contemporary teacher and healers, widely recognized and respected. All offer ways to integrate the events, our focus on relationships and family, our struggle with technology, money, politics and more- into the quest for spiritual fulfillment.",
              industryIdentifiers: [
                { type: "ISBN_13", identifier: "9780874772098" },
                { type: "ISBN_10", identifier: "0874772095" },
              ],
              readingModes: { text: true, image: false },
              pageCount: 304,
              printType: "BOOK",
              categories: ["Religion"],
              averageRating: 5,
              ratingsCount: 1,
              maturityRating: "NOT_MATURE",
              allowAnonLogging: false,
              contentVersion: "preview-1.0.0",
              panelizationSummary: {
                containsEpubBubbles: false,
                containsImageBubbles: false,
              },
              imageLinks: {
                smallThumbnail:
                  "http://books.google.com/books/content?id=FqlPEAAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
                thumbnail:
                  "http://books.google.com/books/content?id=FqlPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
              language: "en",
              previewLink:
                "http://books.google.ca/books?id=FqlPEAAAQBAJ&dq=isbn:9780874772098&hl=&cd=1&source=gbs_api",
              infoLink:
                "http://books.google.ca/books?id=FqlPEAAAQBAJ&dq=isbn:9780874772098&hl=&source=gbs_api",
              canonicalVolumeLink:
                "https://books.google.com/books/about/Chop_Wood_Carry_Water.html?hl=&id=FqlPEAAAQBAJ",
            },
          },
          objectID: "602584002",
          _highlightResult: {
            entry: {
              isbn: {
                value: "9780874772098",
                matchLevel: "none",
                matchedWords: [],
              },
              name: {
                value: "CHOP __aa-highlight__WOOD__/aa-highlight__ CARRY WATER",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
            },
          },
        },
        {
          type: "book",
          entry: {
            id: "d7f9b11d-401c-4ec4-8c0f-dda590c57077",
            isbn: "9781138930582",
            name: "FOOD AND CULTURE: A READER",
            imageUrl:
              "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9781138930582",
            isCampusStoreBook: true,
            campusStorePrice: 10650,
            courses: [
              {
                id: "4fdec9ec-a781-452a-bb36-59a2a9b3c4e8",
                name: "Introduction to Anthropology: Sex, Food and Death",
                code: "1AA3",
                term: "Winter 2022",
                deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                dept: {
                  id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                  name: "Anthropology",
                  abbreviation: "ANTHROP",
                },
              },
              {
                id: "2ba4f9a2-c417-465d-9a1c-15209fcde680",
                name: "Inquiry III: Advanced Inquiry in Health Sciences",
                code: "3E03",
                term: "Winter 2022",
                deptId: "241804ef-6fd0-4078-8d81-566b12f6b898",
                dept: {
                  id: "241804ef-6fd0-4078-8d81-566b12f6b898",
                  name: "Health Sciences",
                  abbreviation: "HTHSCI",
                },
              },
              {
                id: "e8ca93fd-b38a-476f-8363-2b5a54223a42",
                name: null,
                code: "4CC3",
                term: "Winter 2022",
                deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                dept: {
                  id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                  name: "Anthropology",
                  abbreviation: "ANTHROP",
                },
              },
              {
                id: "da4ac753-f50f-41b4-b1d8-ce80e5232d01",
                name: "Dynamic Systems and Control",
                code: "3DX4",
                term: "Winter 2022",
                deptId: "55c57733-75f3-4bc3-b6f6-85f760dcd0f4",
                dept: {
                  id: "55c57733-75f3-4bc3-b6f6-85f760dcd0f4",
                  name: "Software Engineering",
                  abbreviation: "SFWRENG",
                },
              },
            ],
            googleBook: {
              title: "Food and Culture",
              subtitle: "A Reader",
              authors: [
                "Alice P. Julier",
                "Carole Counihan",
                "Penny Van Esterik",
              ],
              publisher: "Routledge",
              publishedDate: "2018-05-08",
              description:
                "This innovative and global best-seller helped establish food studies courses throughout the social sciences and humanities when it was first published in 1997. The 4th edition of Food and Culture contains a new section on water and drinks, and how they tie into meals, a section on policy and activism, and more on obesity and anorexia.",
              industryIdentifiers: [
                { type: "ISBN_10", identifier: "113893058X" },
                { type: "ISBN_13", identifier: "9781138930582" },
              ],
              readingModes: { text: false, image: false },
              pageCount: 656,
              printType: "BOOK",
              maturityRating: "NOT_MATURE",
              allowAnonLogging: false,
              contentVersion: "preview-1.0.0",
              panelizationSummary: {
                containsEpubBubbles: false,
                containsImageBubbles: false,
              },
              imageLinks: {
                smallThumbnail:
                  "http://books.google.com/books/content?id=P8MFtAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
                thumbnail:
                  "http://books.google.com/books/content?id=P8MFtAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
              language: "en",
              previewLink:
                "http://books.google.ca/books?id=P8MFtAEACAAJ&dq=isbn:9781138930582&hl=&cd=1&source=gbs_api",
              infoLink:
                "http://books.google.ca/books?id=P8MFtAEACAAJ&dq=isbn:9781138930582&hl=&source=gbs_api",
              canonicalVolumeLink:
                "https://books.google.com/books/about/Food_and_Culture.html?hl=&id=P8MFtAEACAAJ",
            },
          },
          objectID: "601915002",
          _highlightResult: {
            entry: {
              isbn: {
                value: "9781138930582",
                matchLevel: "none",
                matchedWords: [],
              },
              name: {
                value:
                  "__aa-highlight__FOOD__/aa-highlight__ AND CULTURE: A READER",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
            },
          },
        },
        {
          type: "book",
          entry: {
            id: "2e21c0f3-f8b1-4de7-8438-3df44fde637b",
            isbn: "9780199017850",
            name: "INTRODUCTION TO ANTHROPOLOGY : SEX , FOOD AND DEATH MCMASTER CUSTOM",
            imageUrl:
              "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9780199017850",
            isCampusStoreBook: true,
            campusStorePrice: 5395,
            courses: [
              {
                id: "4fdec9ec-a781-452a-bb36-59a2a9b3c4e8",
                name: "Introduction to Anthropology: Sex, Food and Death",
                code: "1AA3",
                term: "Winter 2022",
                deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                dept: {
                  id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                  name: "Anthropology",
                  abbreviation: "ANTHROP",
                },
              },
            ],
            googleBook: null,
          },
          objectID: "601899002",
          _highlightResult: {
            entry: {
              isbn: {
                value: "9780199017850",
                matchLevel: "none",
                matchedWords: [],
              },
              name: {
                value:
                  "INTRODUCTION TO ANTHROPOLOGY : SEX , __aa-highlight__FOOD__/aa-highlight__ AND DEATH MCMASTER CUSTOM",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
            },
          },
        },
      ],
      nbHits: 6,
      page: 0,
      nbPages: 2,
      hitsPerPage: 5,
      exhaustiveNbHits: true,
      exhaustiveTypo: true,
      query: "food",
      params:
        "query=food&hitsPerPage=5&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__",
      index: "campus-store-data-test",
      renderingContent: {},
      processingTimeMS: 1,
    },
  ],
};

export const ALGOLIA_RESPONSE_3_RESULTS = {
  results: [
    {
      hits: [
        {
          type: "course",
          entry: {
            id: "4fdec9ec-a781-452a-bb36-59a2a9b3c4e8",
            name: "Introduction to Anthropology: Sex, Food and Death",
            code: "1AA3",
            term: "Winter 2022",
            deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
            dept: {
              id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
              name: "Anthropology",
              abbreviation: "ANTHROP",
            },
          },
          objectID: "602817002",
          _highlightResult: {
            entry: {
              name: {
                value:
                  "Introduction to Anthropology: Sex, __aa-highlight__Food__/aa-highlight__ and Death",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
              code: {
                value: "1AA3",
                matchLevel: "none",
                matchedWords: [],
              },
              dept: {
                name: {
                  value: "Anthropology",
                  matchLevel: "none",
                  matchedWords: [],
                },
                abbreviation: {
                  value: "ANTHROP",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
            },
          },
        },
        {
          type: "course",
          entry: {
            id: "e8ca93fd-b38a-476f-8363-2b5a54223a42",
            name: null,
            code: "4CC3",
            term: "Winter 2022",
            deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
            dept: {
              id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
              name: "Anthropology",
              abbreviation: "ANTHROP",
            },
          },
          objectID: "602829002",
          _highlightResult: {
            entry: {
              name: {
                value:
                  "Archaeology of __aa-highlight__Food__/aa-highlight__ways",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
              code: {
                value: "4CC3",
                matchLevel: "none",
                matchedWords: [],
              },
              dept: {
                name: {
                  value: "Anthropology",
                  matchLevel: "none",
                  matchedWords: [],
                },
                abbreviation: {
                  value: "ANTHROP",
                  matchLevel: "none",
                  matchedWords: [],
                },
              },
            },
          },
        },
        {
          type: "book",
          entry: {
            id: "d7f9b11d-401c-4ec4-8c0f-dda590c57077",
            isbn: "9781138930582",
            name: "FOOD AND CULTURE: A READER",
            imageUrl:
              "https://campusstore.mcmaster.ca/cgi-mcm/ws/getTradeImage.pl?isbn=9781138930582",
            isCampusStoreBook: true,
            campusStorePrice: 10650,
            courses: [
              {
                id: "e8ca93fd-b38a-476f-8363-2b5a54223a42",
                name: null,
                code: "4CC3",
                term: "Winter 2022",
                deptId: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                dept: {
                  id: "adb0cea0-7822-400c-8cdb-85d1bf1323af",
                  name: "Anthropology",
                  abbreviation: "ANTHROP",
                },
              },
            ],
            googleBook: {
              title: "Food and Culture",
              subtitle: "A Reader",
              authors: [
                "Alice P. Julier",
                "Carole Counihan",
                "Penny Van Esterik",
              ],
              publisher: "Routledge",
              publishedDate: "2018-05-08",
              description:
                "This innovative and global best-seller helped establish food studies courses throughout the social sciences and humanities when it was first published in 1997. The 4th edition of Food and Culture contains a new section on water and drinks, and how they tie into meals, a section on policy and activism, and more on obesity and anorexia.",
              industryIdentifiers: [
                { type: "ISBN_10", identifier: "113893058X" },
                { type: "ISBN_13", identifier: "9781138930582" },
              ],
              readingModes: { text: false, image: false },
              pageCount: 656,
              printType: "BOOK",
              maturityRating: "NOT_MATURE",
              allowAnonLogging: false,
              contentVersion: "preview-1.0.0",
              panelizationSummary: {
                containsEpubBubbles: false,
                containsImageBubbles: false,
              },
              imageLinks: {
                smallThumbnail:
                  "http://books.google.com/books/content?id=P8MFtAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
                thumbnail:
                  "http://books.google.com/books/content?id=P8MFtAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
              },
              language: "en",
              previewLink:
                "http://books.google.ca/books?id=P8MFtAEACAAJ&dq=isbn:9781138930582&hl=&cd=1&source=gbs_api",
              infoLink:
                "http://books.google.ca/books?id=P8MFtAEACAAJ&dq=isbn:9781138930582&hl=&source=gbs_api",
              canonicalVolumeLink:
                "https://books.google.com/books/about/Food_and_Culture.html?hl=&id=P8MFtAEACAAJ",
            },
          },
          objectID: "601915002",
          _highlightResult: {
            entry: {
              isbn: {
                value: "9781138930582",
                matchLevel: "none",
                matchedWords: [],
              },
              name: {
                value:
                  "__aa-highlight__FOOD__/aa-highlight__ AND CULTURE: A READER",
                matchLevel: "full",
                fullyHighlighted: false,
                matchedWords: ["food"],
              },
            },
          },
        },
      ],
      nbHits: 3,
      page: 0,
      nbPages: 2,
      hitsPerPage: 5,
      exhaustiveNbHits: true,
      exhaustiveTypo: true,
      query: "test",
      params:
        "query=food&hitsPerPage=5&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__",
      index: "campus-store-data-test",
      renderingContent: {},
      processingTimeMS: 1,
    },
  ],
};

export const ALGOLIA_RESPONSE_0_RESULTS = {
  results: [
    {
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: 5,
      exhaustiveNbHits: true,
      exhaustiveTypo: true,
      query: "sdfead",
      params:
        "query=sdfead&hitsPerPage=5&highlightPreTag=__aa-highlight__&highlightPostTag=__%2Faa-highlight__",
      index: "campus-store-data",
      renderingContent: {},
      processingTimeMS: 1,
    },
  ],
};
