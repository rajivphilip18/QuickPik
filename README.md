# QuickPik
QuickPik is a lightweight matrix-based decision platform designed to help groups quickly reach consensus when multiple options and preferences need to be evaluated together.

Schema design -
1. users collection (each user contains - apart from user info it contains poll_ids - a list of all polls created by the user)
2. polls collection (each poll contains - reference to user_id and fields for each row, col pair and vote count as its value)


### Changes
1. change things like polls/mine to user - polls/userpolls
2. scrollbar in home page
3. refresh my poll - instead or also - hide polls
4. Help page
5. style with colors