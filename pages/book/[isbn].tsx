import { Badge, Box, Button, Flex, Grid, HStack, Spacer, Text, Wrap } from "@chakra-ui/react";
import Image from 'next/image'
import { PostCardList } from "@components/CardList";
import Layout from "@components/Layout";
import { useBookQuery } from "@lib/hooks/book";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { resolveImageUrl } from "@lib/helpers/frontend/resolve-image-url";

const BookPage: NextPage = () => {
  const router = useRouter();
  const { isbn } = router.query;
  const { data: book } = useBookQuery(isbn);
  if (!book) {
    return null;
  }
  const { name, googleBook, posts } = book;

  const postsWithBookIncluded = posts.map(post => {
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

  const bookInfo: React.ReactNode = (
    <Grid 
      width='100%' 
      templateColumns={{
        base: "256px 1fr",
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
      <Box gridArea='image'>
        <Flex 
          direction='row' 
          h='100%' 
          justifyContent='center' 
          alignItems='center' 
        >
          <Image 
            alt='book-image' 
            src={resolveImageUrl(book)}
            width='128px'
            height='180px'
          />  
        </Flex>
      </Box>

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

          <Box mt='2'>
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
          </Box>
        </Flex>
        {googleBook && <Button onClick={() => window.open(googleBook.infoLink)}>
          View On Google Books
        </Button>}
      </Flex>
    </Grid>
  )
  

  return (
    <Layout extendedHeader={bookInfo}>
      <PostCardList posts={postsWithBookIncluded} isLinkActive={true} />
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