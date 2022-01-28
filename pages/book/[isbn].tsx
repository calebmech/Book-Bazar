import { Badge, Box, Button, Flex, HStack, Image, List, Spacer, Text } from "@chakra-ui/react";
import CardList, { CardListType } from "@components/CardList";
import Layout from "@components/Layout";
import { useBookQuery } from "@lib/hooks/book";
import { isArray } from "lodash";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { arrayBuffer } from "stream/consumers";

const BookPage: NextPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const { data: book } = useBookQuery(isbn);

  if (!book) {
    return null;
  }
  const { name, googleBook } = book;

  const updatedPosts = book.posts.map((post) => {
    return {
      ...post,
      book: {
        author: googleBook && googleBook.authors ? googleBook.authors.join(',') : '',
        ...book
      },
    }
  })

  

  return (
    <Layout>
      <Flex
      direction='row'
      >
        <Image 
        alt='tst' 
        src={book.imageUrl || ''}
        w='190px'
        shadow={'xl'}
        />

        <Flex direction='column' ml='4' w='500px' justify='space-between'>
          <Text
            fontSize='2xl'
            fontWeight='bold'
          >
            {name}
          </Text>
          <Text
            fontSize='lg'
            fontWeight='semibold'
            color='gray.500'
          >
            {googleBook?.authors?.join(', ')}
          </Text>

          <HStack justify='space-between'>
            {book.courses.map((course, i) => (
              <Badge key={i} variant='subtle' colorScheme='teal'>
                {course.name}
              </Badge>
            ))}
          </HStack>

          <BookInfoRow 
            firstTitle='Publisher'
            secondTitle='Published Date'
            firstInfo={googleBook?.publisher} 
            secondInfo={googleBook?.publishedDate}          
          />

          <BookInfoRow 
            firstTitle='ISBN'
            secondTitle='Page Count'
            firstInfo={isbn && !Array.isArray(isbn) ? isbn  : ''} 
            secondInfo={googleBook?.pageCount?.toString()}          
          />        

          {googleBook && <Button onClick={() => window.open(googleBook.infoLink)}>
            View On Google Books
          </Button>}
        </Flex>
      </Flex>
      <CardList 
        type={CardListType.PostCardList} 
        books={undefined} 
        posts={updatedPosts}
      />
    </Layout>
  );
};

type BookInfoRowProps = {
  firstTitle: string;
  secondTitle: string;
  firstInfo: string | undefined;
  secondInfo: string | undefined;
}

const BookInfoRow = ({firstTitle, secondTitle, firstInfo, secondInfo}: BookInfoRowProps) => {
  return (
    <Box>
      <HStack justify='space-between' color='gray.500'>
        <Text>
          {firstTitle}
        </Text>
        <Text>
          {secondTitle}
        </Text>
      </HStack>
      <HStack justify='space-between' fontSize='xl' fontStyle='bold'>
        <Text>
          {firstInfo ? firstInfo : '-'}
        </Text>
        <Text>
          {secondInfo ? secondInfo : '-'}
        </Text>
      </HStack>
    </Box>
  )
}

export default BookPage;