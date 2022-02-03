import { Badge, Box, Button, Flex, Grid, HStack, Text, Wrap } from "@chakra-ui/react";
import Image from 'next/image'
import { PostCardList } from "@components/CardList";
import Layout from "@components/Layout";
import { useBookQuery } from "@lib/hooks/book";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

const BookPage: NextPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const { data: book } = useBookQuery(isbn);
  if (!book) {
    return null;
  }
  const { name, googleBook, posts } = book;

  const postsWithBook = posts.map(post => {
    return {
      ...post,
      book: book,
    }
  })

  const courseBadges: React.ReactFragment = (
    <Wrap justify='space-between'>
      {book.courses.map((course, i) => (
        <Link key={i} href={'/course/' + course.id} passHref>
          <Badge variant='subtle' colorScheme='teal' cursor='pointer'>
            {course.name}
          </Badge>
        </Link>
      ))}
    </Wrap>
  ) 
  

  return (
    <Layout>
      <Grid 
      width='100%' 
      templateColumns={{
        base: "200px 1fr",
      }}
      templateRows={{
        base: '300px',
      }}
      templateAreas={{
        sm: `'image image' 'info info'`, 
        md: `'image info'`,
      }}
      gap={8}
      >
        <Flex gridArea='image' direction='row' justifyContent='center'>
          <Box shadow='2xl' h='300px' w='200px'>
            <Image 
              alt='book-image' 
              src={book.imageUrl ?? ''}
              width='200px'
              height='300px'
            />  
          </Box>
        </Flex>

        <Flex gridArea='info' direction='column' justify='space-between'>
          <Flex direction='column'>
            <Text fontSize='2xl' fontWeight='bold' >
              {name}
            </Text>
            <Text
              fontSize='lg'
              fontWeight='semibold'
              color='secondaryText'
            >
              {googleBook?.authors?.join(', ')}
            </Text>

            {courseBadges}

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
          </Flex>
          {googleBook && <Button onClick={() => window.open(googleBook.infoLink)}>
            View On Google Books
          </Button>}
        </Flex>
      </Grid>
      <PostCardList posts={postsWithBook} isLinkActive={true} />
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
    <>
      <HStack justify='space-between' color='tertiaryText'>
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
    </>
  )
}

export default BookPage;