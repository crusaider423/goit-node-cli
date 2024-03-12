import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("./db/contacts.json");
const getAllContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const updateContacts = async (contacts) => {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export async function listContacts() {
  const data = await getAllContacts();
  return data;
}

export async function getContactById(contactId) {
  const data = (await getAllContacts()).find(({ id }) => id === contactId);
  return data || null;
}

export async function removeContact(contactId) {
  const contacts = await getAllContacts();

  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const [deletedContact] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return deletedContact;
}

export async function addContact(name, email, phone) {
  const contacts = await getAllContacts();
  const dublicat = contacts.find(
    ({ email: existingEmail, phone: existingPhone }) =>
      existingEmail === email || existingPhone === phone
  );
  if (dublicat) return "this contact alredy exists";
  const contact = { name, email, phone, id: nanoid() };

  contacts.push(contact);
  await updateContacts(contacts);
  return contact;
}
