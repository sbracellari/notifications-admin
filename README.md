# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Notifications Admin](#notifications-admin)
  - [Location and Interaction](#location-and-interaction)
  - [Project Setup](#project-setup)
  - [Build Processes](#build-processes)
    - [Building With Demo Data](#building-with-demo-data)
    - [Building With Real Data](#building-with-real-data)
    - [Building For uPortal](#building-for-uportal)
  - [Service URL](#service-url)

## Notifications Admin

Notifications Admin allows users from specific groups to conditionally create, review, approve, deny, disable, and delete announcements and notifications. This project is the result
of the Notifications and Announcements projects being combined into one central hub for student information. The following are the three groups of individuals who will interact with this
soffit in uPortal, along with their permissions:

- Portal Administrators: can create a notification at any priority level, can approve/deny the SQL that pertains to a notification, and can act as a moderator an approve the notification as a whole. Portal Administrators can also delete and disable/enable notifications.
- Announcement Moderators: can create a notification of PL 5 only (this can also be thought of as an announcement), and can approve/deny notifications after SQL has been approved by a Portal Administrator.
- Announcement Authors: can only create a notification of PL 5. No approve/deny permissions are granted to Announcement Authors.

All groups can view announcements/notifications that are active, scheduled, pending, and denied. Only Portal Administrators may see disabled notifications.

## Location and Interaction

This project will live under the `Edit Content` tab. Only those that are in the groups mentioned above will have this tab available to them. The target audience is, again, anyone in those groups.

-----

## Project Setup

If this is your **FIRST** time setting this project up, this is what you'll need to do (you will need to have postgres and the `uportal5` database set up on your machine prior). All of this is to be done LOCALLY.

1. Clone down the `notifications` project (this is **different** from the `notifications-admin` project)
2. Navigate to `src/main/resources`
3. Open up the `schema.sql`
   1. In the `schema.sql`, change all instances of `uportaladmin` to match your local uportal postgres user (its probably just `uportal`)
   2. Still in the `schema.sql`, comment out any lines having to do with `argosuser`
4. Open the `updates.sql`
   1. Uncomment any commented SQL statements


> **NOTE:** If this is not your first time doing this, and you just want to clear out your local database after testing, keep the changes in `schema.sql`, but reverse the ones in `updates.sql`

To actually port these changes over to the database, run the following two commands, in this order, while in the `src/main/resources` folder of the `notifications` project:

1. `psql -d uportal5 -f schema.sql`
2. `psql -d uportal5 -f updates.sql`

For a quick lesson - the `-d` flag indicates what database you want to connect to, and the `-f` flag indicates what file you want to dump. If everything has gone correctly, you should be done with the special setup of this soffit. Everything else will be similar to other projects.

## Build Processes

### Building With Demo Data

To build this project with demo data, navigate to `/src/main/react/public/index.html` and change `is_demo` to true. To build once demo data has been turned on, run an `npm i && npm start` in the `src/main/react` folder. Now you can interact with the frontend without having to run the backend (this is good for testing frontend-specific changes).

### Building With Real Data

If you'd like to run the frontend with actual data but still outside of uPortal, ensure that the `is_demo` variable is set back to false. Then, in `src/main/react/src/api/api.js`, remove the prepended `/notifications` from *all* of the fetch requests. After that, you can simultaneously run a `./gradlew clean bootRun` in the root of the project, and an `npm start` in the `/src/main/react` folder. Doing this will give you real data without running the project inside of uPortal.

> **IMPORTANT:** Most of our soffits will have a mock token used for running the project with real data outside of uPortal. At the time of writing this README, this project does not (you can check to see if a token exists in `src/main/react/public/index.html`, the same place the `is_demo` variable is located). To get around the lack of a mock token, you will have to hardcode a few things in the `NotificationTypeController.java` in `src/main/java/.../controller`. Any place you see the `authorizer` being used will not work if there is no token provided, and this is where you will have to swap to harcoded values (just for testing purposes).

### Building For uPortal

To build in preparation to deploy to uPortal, add all of the `/notifications` back to each endpoint in `/src/main/react/src/api/api.js`, make sure that `is_demo` is set to false, and make sure that, if you had to hardcode values in the `NotificationTypeController.java`, you change those values back to what they were originally. Next, in the root of the project, run a `./gradlew clean build`. Then, you can follow [this](https://code.oakland.edu/ea-developers/training/-/tree/master/06-mysail-development/soffits#deploying-a-soffit-to-uportal) guide to deploy the soffit to uPortal.

> **Note:** If for some reason you want to, you can deploy a soffit to uPortal with demo data turned on. Sometimes this is useful if you're just trying to test if the soffit looks alright in uPortal, for example.

## Service URL

The service URL used for registering/adding this project to uPortal is the following:

- `notifications-admin/soffit/notifications-admin`
