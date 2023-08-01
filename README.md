# Mail Service
This is project number 3 of the CS50 Web Development course with Django and JavaScript lectured by Harvard CS department.

## Screencast of project
https://www.youtube.com/watch?v=bavRAFoinm4&t=18s

## Send Mail
When a user submits the email composition form, we add JavaScript code to actually send the email. Once the email has been sent, we load the user’s sent mailbox.

![image](https://github.com/Fernando-Urbano/cs50w-p3-mail/assets/99626376/b314995f-a769-4989-9ae4-60196f575495)

## Mailbox
When a user visits their Inbox, Sent mailbox, or Archive, we load the appropriate mailbox. When a mailbox is visited, the application first queries the API for the latest emails in that mailbox. If the email is unread, it appears with a white background. If the email has been read, it appears with a gray background.

![image](https://github.com/Fernando-Urbano/cs50w-p3-mail/assets/99626376/7e91b756-c0c0-4f0c-8f7b-560ae108def3)

## View Mail
When a user clicks on an email, the user is taken to a view where they see the content of that email.

![image](https://github.com/Fernando-Urbano/cs50w-p3-mail/assets/99626376/19e06766-5a8d-4c52-b697-7590b97349b1)

## Archive and Unarchive
The software allows users to archive and unarchive emails that they have received.

![image](https://github.com/Fernando-Urbano/cs50w-p3-mail/assets/99626376/5269b9b7-ee6a-4c5f-8fd4-eef504dfffb5)

## Reply
The software allows users to reply to an email.

<img width="530" alt="image" src="https://github.com/Fernando-Urbano/cs50w-p3-mail/assets/99626376/2695d4fc-5a4e-4c34-8de2-76bd618a64af">
