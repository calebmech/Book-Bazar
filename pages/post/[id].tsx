import { Badge, Box, Button, Flex, Grid, Heading, HStack, Icon, Image, List, Spacer, Text, VStack } from "@chakra-ui/react";
import { PencilAltIcon, TrashIcon, MailIcon, ChatIcon } from '@heroicons/react/solid'
import Layout from "@components/Layout";
import UserWithAvatar from "@components/UserWithAvatar";
import { useBookQuery } from "@lib/hooks/book";
import { usePostQuery } from "@lib/hooks/post";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PostCardList } from "@components/CardList";
import { useUserQuery } from "@lib/hooks/user";
import moment from 'moment'
import Link from "next/link";


const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = usePostQuery(id);
  const { data: book } = useBookQuery(post?.book.isbn);
  const { user, isAuthenticated } = useUserQuery();

  
  if (!post) {
    return null;
  }
  
  const isPostOwnedByUser = post.user ? user?.id === post.user.id : false;
  
  var buttonText: string;
  var buttonFragment: React.ReactNode;
  if (isPostOwnedByUser) {
    buttonText = "Post Options";
    buttonFragment = (
      <>
        <Button leftIcon={<Icon as={PencilAltIcon} />} colorScheme='teal'>
          Edit
        </Button>
        <Button leftIcon={<Icon as={TrashIcon} />} colorScheme='red'>
          Delete
        </Button>
      </>
    )
  } else if (user) {
    buttonText = "Post Options";
    buttonFragment = (
      <>
        <Button leftIcon={<Icon as={MailIcon} />} colorScheme='messenger'>
          Email
        </Button>
        <Link href={'https://teams.microsoft.com/l/chat/0/0?users=' + post.user?.email} passHref>
          <Button leftIcon={<Icon as={ChatIcon} />} colorScheme='teal' >
            Microsoft Teams
          </Button>
        </Link>
        
      </>
    )
  } else {
    buttonText = "Sign in to interact with the owner of this post.";
  }

  const otherPosts = book?.posts
    .filter(p => p.id !== post.id)
    .map(p => {
      return {
        ...p,
        book: book,
      }
    });

  return (
    <Layout>
      <Grid 
      width='100%' 
      templateColumns={{
        base: "300px 1fr",
      }}
      templateRows={{
        base: '400px',
      }}
      templateAreas={{
        sm: `'image image' 'info info'`, 
        md: `'image info'`,
      }}
      gap={8}
      >
        <Flex gridArea='image' direction='row' justifyContent='center'>
          <Box shadow='2xl' h='400px' w='300px' borderRadius='md' overflow='hidden'>
            <Image 
              alt='book-image' 
              src={post.imageUrl ?? ''}
              width='300px'
              height='400px'
            />  
          </Box>
        </Flex>

        <Flex gridArea='info' direction='column' justifyContent='space-between' minH='200px'>
          <Box>
            <HStack alignItems='flex-start'>
              <Heading>
                {book?.name}
              </Heading>
              <Heading color='teal'>
                ${post.price}
              </Heading>
            </HStack>
            <HStack>
              <Text>
                Posted {isAuthenticated && "by"}
              </Text>
              <UserWithAvatar user={post.user} isYou={isPostOwnedByUser} />
              <Text>
                {moment(post.createdAt).fromNow()}
              </Text>
            </HStack>


            <Text>
              {post.description}
            </Text>
          </Box>
          <Box>
            <Text fontWeight='bold'>
              {buttonText}
            </Text>
            <HStack>
              {buttonFragment}
            </HStack>
          </Box>
        </Flex>
      </Grid>
      <PostCardList posts={otherPosts ?? []} isLinkActive/>
    </Layout>
  );
};




export default PostPage;
