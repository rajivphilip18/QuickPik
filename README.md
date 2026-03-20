# QuickPik
QuickPik is a lightweight matrix-based decision platform designed to help groups quickly reach consensus when multiple options and preferences need to be evaluated together.

Schema design -
1. users collection (each user contains - apart from user info it contains poll_ids - a list of all polls created by the user)
2. polls collection (each poll contains - reference to user_id and fields for each row, col pair and vote count as its value)


### Pending Activities
1. Help page
2. style with colors
3. add footer
4. passport authentication
5. generate a poll consisting of 1000 users