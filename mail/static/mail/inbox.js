document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        const element = document.createElement('div');
        element.className = 'email';

        element.style.border = '1px solid black';

        // Check if the email is read or unread and apply styling accordingly
        if (email.read) {
          element.style.backgroundColor = '#f0f0f0'; // Read email background color
        } else {
          element.style.backgroundColor = '#ffffff'; // Unread email background color
          element.style.fontWeight = 'bold'; // Make unread emails bold
        }

        // Rest of your code
        element.innerHTML = `
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-timestamp">${email.timestamp}</div>`;
        element.addEventListener('click', () => load_email(email.id, mailbox));
        document.querySelector('#emails-view').append(element);
      });
    });
}

function send_email(event) {
  event.preventDefault();
  // Send email
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
      load_mailbox('sent');
    });
}

function load_email(email_id, mailbox) {
  // Get email
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // Create div element
      const element = document.createElement('div');
      element.className = 'email';

      // Check if the email is read or unread and apply styling accordingly
      if (email.read) {
        element.style.backgroundColor = '#f0f0f0'; // Read email background color
      } else {
        element.style.backgroundColor = '#ffffff'; // Unread email background color
        element.style.fontWeight = 'bold'; // Make unread emails bold
        // Mark email as read
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }
      // Show the email and hide other views
      document.querySelector('#emails-view').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';

      // Show the email
      document.querySelector('#emails-view').innerHTML = `
        <div class="email-sender">From: ${email.sender}</div>
        <div class="email-recipients">To: ${email.recipients}</div>
        <div class="email-subject">Subject: ${email.subject}</div>
        <div class="email-timestamp">Timestamp: ${email.timestamp}</div>
        <hr>
        <div class="email-body">${email.body}</div>
        <br>`;

      // Add archive button if the email is in inbox or sent
      if (mailbox === 'inbox') {
        const archive = document.createElement('button');
        archive.className = 'btn btn-sm btn-outline-primary';
        archive.innerHTML = 'Archive';
        archive.addEventListener('click', () => archive_email(email_id, email.archived));
        document.querySelector('#emails-view').append(archive);
        document.querySelector('#emails-view').append(' ');
      }

      // Add unarchive button if the email is in archive
      if (mailbox === 'archive') {
        const unarchive = document.createElement('button');
        unarchive.className = 'btn btn-sm btn-outline-primary';
        unarchive.innerHTML = 'Unarchive';
        unarchive.addEventListener('click', () => archive_email(email_id, email.archived));
        document.querySelector('#emails-view').append(unarchive);
      }

      // Add reply button
      const reply = document.createElement('button');
      reply.className = 'btn btn-sm btn-outline-primary';
      reply.innerHTML = 'Reply';
      reply.addEventListener('click', () => reply_email(email));
      document.querySelector('#emails-view').append(reply);
    });
}

function archive_email(email_id, archived) {
  // Archive or unarchive email
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !archived
    })
  })
    .then(() => load_mailbox('inbox'));
}

function reply_email(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Pre-fill composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  if (email.subject.includes('Re: ')) {
    document.querySelector('#compose-subject').value = email.subject;
  } else {
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n\n`;
}
