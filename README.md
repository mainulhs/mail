# CS50’s Web Programming with Python and JavaScript (Project 3: Mail)

## Mail
This is a front-end for an email client that makes API calls to send and receive emails. The client supports sending emails, replying to emails, archiving and unarchiving emails, and viewing the inbox, sent, and archived emails of the user.

## Requirements
- [Python 3](https://www.python.org/downloads/)
- [Django 4](https://www.djangoproject.com/download/)

## How to Run

1. Clone this repository.
2. Open a terminal window and navigate to the project folder.
3. Install the required packages: `pip install -r requirements.txt`
4. Run `python manage.py makemigrations mail` to make migrations for the mail app.
5. Run `python manage.py migrate` to apply migrations to your database.
6. Run `python manage.py runserver` to start the server.
7. In a web browser, go the URL provided by the terminal.