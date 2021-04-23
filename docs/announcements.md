# ANNOUNCEMENTS PLAN OF EXECUTION

## AREAS OF MODIFICATION

### NOTIFICATIONS DATABASE

- [x] Add the following columns to the `ou_notif_type` table: `rich_text`, `notifsql`, `category`, and `author`

  ```sql
  -- for the table modification
  ALTER TABLE
      notifications.ou_notif_type
  ADD
      COLUMN rich_text TEXT,
  ADD
      COLUMN notifsql TEXT,
  ADD
      COLUMN category TEXT
  ADD
      COLUMN author TEXT;
  ```

- [x] Make the following alterations to the `ou_notif_type` table

  ```sql
  -- at this point, the priority level table and the ou_notif_type table would be populated
  -- the original 7 notifs would also include the 4 columns added above
  -- then, non-null constraints can be added to the notifsql, category, and author columns

  ALTER TABLE
      notifications.ou_notif_type 
      ALTER notifsql
  SET
      NOT NULL,
      ALTER category
  SET
      NOT NULL,
      ALTER active_ind
  SET
      DEFAULT FALSE,
      ALTER author
  SET
      NOT NULL;
  ```

  ```sql
  -- this is now the expected structure of the notifs schema
  CREATE TABLE IF NOT EXISTS notifications.ou_notif_type (
      id SERIAL PRIMARY KEY,
      priorityid INTEGER REFERENCES notifications.ou_notif_pl(id) NOT NULL,
      notifname VARCHAR(40) NOT NULL,
      notifdesc VARCHAR(125) NOT NULL,
      snooze_length INTEGER NOT NULL DEFAULT 7,
      date_start DATE NOT NULL,
      date_end DATE NOT NULL,
      url_more VARCHAR(255),
      notif_unique BOOLEAN NOT NULL,
      active_ind BOOLEAN NOT NULL DEFAULT FALSE,
      rich_text TEXT,
      notifsql TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL
  );
  ```

  The table will have the following columns:

  **`ou_notif_type`**

  |id       |priorityid|notifname  |notifdesc   |snooze_length|date_start|date_end|url_more    |notif_unique|active_ind|rich_text |notifsql |category |author |
  |:-------:|:--------:|:---------:|:----------:|:-----------:|:--------:|:------:|:----------:|:----------:|:--------:|:--------:|:-------:|:-------:|:-----:|
  |serial pk|integer   |varchar(40)|varchar(125)|integer      |date      |date    |varchar(255)|boolean     |boolean   |text      |text     |text     |text   |
  
- [x] Create an `ou_notif_approval` table to track both SQL and moderator approvals

  ```sql
  CREATE TABLE IF NOT EXISTS notifications.ou_notif_approval (
    id SERIAL PRIMARY KEY,
    notifid INTEGER REFERENCES notifications.ou_notif_type(id) NOT NULL,
    sql_approved BOOLEAN,
    sql_approval_date DATE,
    sql_approval_pidm INTEGER,
    moderator_approved BOOLEAN,
    moderator_approval_date DATE,
    moderator_approval_pidm INTEGER
  )
   ```

  The table will have the following columns:

  **`ou_notif_approval`**

  |id       |notifid|sql_approved|sql_approval_date|sql_approval_pidm|moderator_approved|moderator_approval_date|moderator_approval_pidm|
  |:-------:|:-----:|:----------:|:---------------:|:---------------:|:----------------:|:---------------------:|:---------------------:|
  |serial pk|integer|boolean     |date             |integer          |boolean           |date                   |integer                |

## NOTIFICATION SYNC

**Basic process:** the sync process will grab all notifications, read them into a list, iterate through that list, and run each notification's associated SQL

- [x] First and foremost, the sync process will have to be converted from a command line runner to a webapp
- [x] The sync process should not break if any one notification fails to be run; instead it should keep track of which notifications failed to go in (if any) and send an email at the end of the process, detailing which notifications failed
- [x] The sync process will maintain current safeguards (i.e. checking insert count vs query count, inserting insert count to notif count table)

## NOTIFICATIONS BACKEND

The first order of business is creating some endpoints to achieve what we need. We'll also show a brief idea of the corresponding SQL

- [x] **Notification Creation**

`@PostMapping("notifications/v1/notification-type")`

- This one is pretty straightforward. This EP will be called whenever a new notification is created on the notifications admin frontend
- These are the attributes that each notification will have (written how they will appear in the `ou_notif_type` database table)
  - id
  - priorityid
  - notifname
  - notifdesc
  - snooze_length
  - date_start
  - date_end
  - url_more
  - notif_unique
  - active_ind
  - rich_text
  - notifsql
  - category
  - author
- All attributes (except `id`) will come from the frontend. `id` wil be inserted automatically on a new row creation.

This endpoint will have to include some SQL scrubbing:

- [x] Check for use of certain keywords in the SQL, reject SQL if ay of them are are present
- [x] Check for the existence of the proper columns in the SQL, reject SQL if they are not present

This is the only EP with business logic.

- [x] **Developer approval/disapproval**

`@PutMapping("notifications/v1/{notificationTypeId}/approval/developer")`

- If a developer approves the sql, the `sql_approved` attribute in the `notifications.ou_notif_approval` table gets flipped to `true` for that record and the notif goes to a moderator. Whether or not the notif gets marked active depends on what the `moderator_approved` value is also.
- If they disapprove, the notif never goes to a moderator

- [x] **Moderator approval/disapproval**

`@PutMapping("notifications/v1/{notificationTypeId}/approval/moderator")`

- Moderators only approve notifications in which the SQL has already been approved
- If they approve, `moderator_approved` in `notifications.ou_notif_approval` is flipped to `true`, and whether or not the notif gets marked active depends on what the `sql_approved` value is also.
- If they disapprove, the notif will never go live

- [x] **Grab all notifications**

`@GetMapping("notifications/v1/all")`

- This is simply to get all of the notifications and information about their approval from the `ou_notif_type`  and `ou_notif_approval` tables

- [x] **Turn a notif on or off**

`@PutMapping("notifications/v1/{notificationTypeId}/disable")`

- This will just flip `active_ind` to true or false if you're turning the notification on or off, respectively

- [x] **Delete a notification**

`@PostMapping("notifications/v1/{notificationTypeId}/removal")`

- This EP will delete a notification and its corresponding approval record from the `ou_notif_type`  and `ou_notif_approval` tables

## NOTIFICATIONS FRONTEND

- [x] Only showing notifs that are active and today is between the start/end date of the notification
- [x] Using the more info button to open up announcements in their own soffit view
  - Store data in local storage, use a direct URL to announcements student view, announcements will grab that info from local storage and display it
- [x] Any other modifications necessary to hook everything up

## NOTIFICATIONS ADMIN

This is where people will come to create and view notification.

There are three uPortal groups that can interact with this project:

- Portal Administrators: can create a notification at any priority level, can approve/deny the SQL that pertains to a notification, and can act as a moderator an approve the notification as a whole. Portal Administrators can also delete and disable/enable notifications. The group is called `developer` in this project.
- Announcement Moderators: can create a notification of PL 5 only (this can also be thought of as an announcement), and can approve/deny notifications after SQL has been approved by a Portal Administrator. The group is called `moderator` in this project.
- Announcement Authors: can only create a notification of PL 5. No approve/deny permissions are granted to Announcement Authors. The group is called `author` in this project.

### Creating a Notification

The following fields will be included when creating a notification/announcement:

- Title (**REQUIRED**)
- Description (**REQUIRED**)
- Rich text
  - This option only appears if an announcement is being created
- URL
  - **NOTE:** Only developers can specify a URL
- Start date (**REQUIRED**)
- End date (**REQUIRED**)
- Snooze length (**REQUIRED**)
- Priority level (**REQUIRED**)
  - **NOTE:** Only developers can choose the priority level of a notification. Any notifications created by someone who is not a developer will automatically be of priority level 5
- SQL for who should see the notification (**REQUIRED**)
- Whether the notif is unique or not (**REQUIRED**)

`category`, `author` and `id` will also be a part of the record. `id` is taken care of automatically on insertion. `category` is dependent on who created the notification. For moderators and authors, `category` is automaticall set to `announcement`. `developers` have a choice between `announcement` and `notification`.

### Viewing Notifications

This is where people will come to approve a notification.

Developers will be approving SQL, and moderators will be approving notifications that have already had their SQL approved.

- There are 5 tabs: Approved, Denied, Pending, Disabled, and Create
  - APPROVED
    - The approved tab has two sections. Everyone can see both sections, but what actions can be taken against notifications that fall into these categories will differ based on group
      - Active: notifications that have been approved and today is between the start and end date
      - Scheduled: notifications that have been approved and today is before the start date
  - DENIED
    - `developers` will see notifications that have had the SQL denied, with the option to re-approve
    - `moderators` will see notifications that have been denied by a moderator, with the option to re-approve
    - `authors` will just see general denied notifications, will no actions to take
  - PENDING
    - `developers` are able to see notifications that are pending both developer and moderator approval. They can approve both as well.
    - `moderators` are only able to see and approve notifications pending moderator approval.
    - `authors` are able to see notifications pending moderator approval, but are not able to take action against them.
  - DISABLED
    - Displays notifications that have been turned off. Only `developers` can see this, as they are the only group with permission to turn notifications on and off
  - CREATE
    - This is where you go to create a notification

## ANNOUNCEMENTS STUDENT VIEW

- This view will only be visible when a student clicks the link out on a notification (that has a category of `announcement`). It will have to nicely portray every aspect of an announcement that a student should see, i.e. its
  - Title
  - Description
  - Rich text (this can include things like images, urls, etc.)

## NOTIFICATIONS DASHBOARD

- [ ] Modify this project so that it's only displaying data for active notifications

## NICE TO HAVES/V2 STUFF

- A way for developers to run the sync process from the frontend, outside of its scheduled time, so that a notification can be turned on/off and then the sync process can be ran to update everything almost immediately
- Predefined groups for the `notifsql`, like student, faculty, etc.
- Information modals throughout the project, explaining how things work
