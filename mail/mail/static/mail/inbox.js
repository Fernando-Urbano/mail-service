document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-submit').addEventListener('click', submit_compose);
  
  document.querySelector('#emails-view-error-message').style.display = 'none';
  document.querySelector('#selected-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Hide the error message
  document.querySelector('#emails-view-error-message').style.display = 'none';

  // Show compose view and hide other views
  document.querySelector('#selected-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
}

function selected_email_view(emailId) {

  document.querySelector('#selected-email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  console.log(`Read e-mail ${emailId}`)
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })

  fetch(`/emails/${emailId}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
    const userEmail = document.querySelector('#user-email').textContent
    document.querySelector("#selected-email-title").textContent = email.subject == "" ? "No subject" : email.subject;
    if (userEmail !== email.sender) {
      document.querySelector('#archive-button').style.display = 'block';
      document.querySelector('#unread-button').style.display = 'block';
      document.querySelector('#archive-button').textContent = email.archived ? "Unarchive" : "Archive";
      document.querySelector('#unread-button').textContent = email.read ? "Mark as Unread" : "Mark as Read";
      var old_element = document.querySelector('#archive-button');
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      var old_element = document.querySelector('#unread-button');
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      document.querySelector('#archive-button').addEventListener('click', function () {
        if (email.archived) {
          console.log(`Unarchived e-mail ${email.id}`)
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false
            })
          })
          email.archived = false;
          document.querySelector('#archive-button').textContent = "Archive";
        } else {
          console.log(`Archived e-mail ${email.id}`)
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
          })
          email.archived = true;
          document.querySelector('#archive-button').textContent = "Unarchive";
        }
      })
      document.querySelector('#unread-button').addEventListener('click', function ()  {
        if (email.read) {
          console.log(`Unread e-mail ${email.id}`)
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: false
            })
          })
          email.read = false;
          document.querySelector('#unread-button').textContent = "Mark as Read";
        } else {
          console.log(`Read e-mail ${email.id}`)
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            })
          })
          email.read = true;
          document.querySelector('#unread-button').textContent = "Mark as Unread";
        }
      })
    } else {
      console.log("Hid archive and unread buttons because current user is the sender of the e-mail")
      document.querySelector('#archive-button').style.display = 'none';
      document.querySelector('#unread-button').style.display = 'none';
    }
    document.querySelector("#selected-email-timestamp").textContent = email.timestamp
    document.querySelector("#selected-email-sender").textContent = "From: " + email.sender
    document.querySelector("#selected-email-recipients").textContent = "To: " + email.recipients.join(", ")
    document.querySelector("#selected-email-content").textContent = email.body === "" ? "No content" : email.body
    // Reply to e-mail
    var old_element = document.querySelector('#reply-button');
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    document.querySelector('#reply-button').addEventListener('click', function ()  {
      compose_email()
      console.log(`${userEmail} - ${email.sender}`)
      var reEmailRecipient = userEmail === email.sender ? email.recipients.join(", ") : email.sender;
      document.querySelector('#compose-recipients').value = `${email.sender}`;
      var reEmailSubject = email.subject.substring(0, 4) === "Re: " ? email.subject : `Re: ${email.subject}`
      document.querySelector('#compose-subject').value = reEmailSubject;
      reEmailBody = (
        `\n\n\n\n\n----------------------------------------------\n${email.sender} on ${email.timestamp}:\n${email.body}`
      )
      document.querySelector('#compose-body').value = reEmailBody;
    })
  });

}

function submit_compose(event) {

  document.querySelector('#emails-view-error-message').style.display = 'none';
  const form = document.querySelector('#compose-form');
  event.preventDefault();

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      if (result.hasOwnProperty('error')) {
        document.querySelector('#emails-view-error-message').style.display = 'block';
        document.querySelector('#emails-view-error-message').innerHTML = result.error
      } else {
        form.submit();
      }
  })
  .catch(error => {
    console.log("Error: ", error);
    document.querySelector('#emails-view-error-message').style.display = 'block';
    document.querySelector('#emails-view-error-message').innerHTML = `Error: ${error}`;
  })

  return false
}

function load_mailbox(mailbox) {

  // Show compose view and hide other views
  document.querySelector('#selected-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox and hide other views
  console.log(`Clicked in ${mailbox} button`)
  const title = mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  const userEmail = document.querySelector('#user-email').textContent
  console.log(`Logged user: ${userEmail}`)
  document.querySelector('#emails-view-title').innerHTML = title

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    const box = document.querySelector('#emails-view-body')
    box.innerHTML = '';
    if (emails.length === 0) {
      console.log("No e-mails in current session");
      box.innerHTML = `<h6>No e-mails in current session.</h6>`;
    } else if (emails.hasOwnProperty('error')) {
      console.log("Error: ", emails.error);
      box.innerHTML = `<h3>Error: ${emails.error}</h3>`;
    } else {
      // Generate div for each
      for (const email of emails) {
        const individualMail = document.createElement('div')
        if (email.read) {
          individualMail.classList.add('read-email');
        } else {
          individualMail.classList.add('unread-email');
        }
        let subject;
        if (email.subject === ""){
          subject = "No subject";
        } else {
          subject = email.subject;
        }
        const userSubject = document.createElement('span');
        const timestamp = document.createElement('span');
        let selectedUser;
        if (email.sender == userEmail){
          selectedUser = "To: " + email.recipients.join(", ");
        } else {
          selectedUser = "From: " + email.sender;
        }
        userSubject.textContent = selectedUser + ' - ' + subject;
        timestamp.textContent = '(' + email.timestamp + ')';
        userSubject.classList.add('mail-info');
        timestamp.classList.add('mail-timestamp');
        individualMail.appendChild(userSubject);
        individualMail.appendChild(timestamp);
        individualMail.setAttribute('data-id', email.id);
        individualMail.addEventListener('click', function() {
          console.log(`Selected e-mail ${this.dataset.id}`)
          selected_email_view(this.dataset.id)
        });
        box.appendChild(individualMail)
      }
    }
    document.querySelector('#emails-view').append(box);
  })
  .catch(error => {
    console.log("Error: ", error);
    const box = document.querySelector('#emails-view-body')
    box.innerHTML = `<h6>Error: ${error}</h6>`;
  });
}
