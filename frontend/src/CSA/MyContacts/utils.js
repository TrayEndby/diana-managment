import contactService from 'service/ContactService';
import * as CSA_ROUTES from 'constants/CSA/routes';

export const handleMessage = async (userId, history, handleError) => {
  try {
    const contactList = await contactService.listContact();
    const thisContactList = contactList.filter((contact) => contact.contact_id === userId);
    if (thisContactList.length === 0) {
      await contactService.addContact(userId, 64);
    } else {
      const thisContact = thisContactList[0];
      if (thisContact.status !== 64) {
        await contactService.updateContact(userId, 64);
      }
    }
    history.push(`${CSA_ROUTES.MY_BUSINESS_CONVERSATIONS}?selectedId=${userId}`);
  } catch(e) {
    handleError(e);
  }
};
