---
title: Counting users in teams
weight: 2
---

## Active users

An active user is anyone who triggers a build manually from the Codemagic UI, via the API, or automatically from a webhook in response to events in the repository. Active users are marked with a green badge with the build count on it. The number of active users for the ongoing subscription period is shown on the right sidebar in team settings.

The active users count is reset at the beginning of every month. Check the Billing history on the [Billing](../billing/billing) page to see the active users of previous subscription periods.

## Identifying users

Codemagic distinguishes users by the email address that is associated with their Codemagic account (when starting builds manually) or with the commit author (when triggering builds from a webhook). We recommend setting the email address in your git configuration to match the email address used in Codemagic to avoid getting counted twice. You can configure the email address in your terminal as follows:

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

## User limit

To avoid unexpected costs, team owners can limit the maximum number of users allowed to run builds. Any number of users within the limit will be allowed to run builds. If the number of active users for the current subscription period is equal to the limit, builds from other users will be blocked. You can see the blocked build attempts in team settings. 

To allow builds from additional users, team owners can increase the user limit by clicking **Manage billing** in team settings or selecting the team on the Billing page and then clicking **Update user limit** in Billing overview. Note that when decreasing the current limit, the new limit will apply starting from the next subscription period.
