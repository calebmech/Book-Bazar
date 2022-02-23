import {
  Button,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  CashIcon,
  LocationMarkerIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";

const SHOWN_MODAL_LOCAL_STORAGE_KEY = "SHOWN_SAFE_INTERACTION_TIPS_MODAL";

export interface SafeInteractionTipsModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  onAccept: VoidFunction;
}

export default function SafeInteractionTipsModal({
  isOpen,
  onClose,
  onAccept,
}: SafeInteractionTipsModalProps) {
  const hasUserSeenModal =
    localStorage.getItem(SHOWN_MODAL_LOCAL_STORAGE_KEY) === "true";

  const handleAccept = () => {
    onAccept();
    onClose();
    localStorage.setItem(SHOWN_MODAL_LOCAL_STORAGE_KEY, "true");
  };

  if (hasUserSeenModal) {
    if (isOpen) {
      onAccept();
      onClose();
    }
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Before you meet up&hellip;</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            It&rsquo;s important to keep safety in mind when meeting up with
            anyone new you meet online. Here are a few tips!
          </Text>
          <List mt="6" mb="1" spacing="6">
            <ListItem display="flex" align="start" fontWeight="500">
              <ListIcon
                as={LocationMarkerIcon}
                width="12"
                padding="3"
                height="12"
                mr="5"
                borderRadius="full"
                color="blue.600"
                backgroundColor="blue.100"
              />
              Decide on a busy and well lit location to meet such as Thode or
              MUSC
            </ListItem>
            <ListItem display="flex" align="start" fontWeight="500">
              <ListIcon
                as={CashIcon}
                width="12"
                padding="3"
                height="12"
                mr="5"
                borderRadius="full"
                color="green.600"
                backgroundColor="green.100"
              />
              Don&rsquo;t send money before you have a chance to see the
              textbook with your own eyes
            </ListItem>
            <ListItem display="flex" align="start" fontWeight="500">
              <ListIcon
                as={UserGroupIcon}
                width="12"
                padding="3"
                height="12"
                mr="5"
                borderRadius="full"
                color="pink.600"
                backgroundColor="pink.100"
              />
              All Book Bazar users are part of the McMaster community, so rest
              assured!
            </ListItem>
          </List>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleAccept}>
            Sounds good!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
