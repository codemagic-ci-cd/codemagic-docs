---
title: Counting users in teams
weight: 2
---

You can invite your team members to join the team in Codemagic free of charge. We'll charge only for active users, see our pricing information [here](https://codemagic.io/pricing/).

## Active users

An active user is anyone who triggers a build manually from the UI or via the API, or automaticlly from a webhook in response to events in the repository. The number of active users for the ongoing subscription period is shown on the right sidebar in team settings. The active users count is reset at the beginning of every month.

## Identifying users

Codemagic distinguishes users by the email address that is associated with their Codemagic account (when starting builds manually) or with the commit author (when triggering builds from a webhook). We recommend setting the email address in your git configuration to match the email address used in Codemagic to avoid getting counted twice. You can configure the email address in your terminal as follows:

```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

## User limit

To avoid unexpected costs, team owners can set a limit to the maximum number of users allowed to run builds. Any number of users within the limit will be allowed to run builds. If the number of active users for the current subscription period is equal to the limit, builds from other users will be blocked. You can see the blocked build attempts in team settings. 

To allow builds from additional users, team owners can increase the user limit by clicking **Manage billing** in team settings or selecting the team on the Billing page and then clicking **Update user limit** in Billing overview. Note that when decreasing the current limit, the new limit will apply starting from the next subscription period.

At the end of the subscription period, you will be charged only for the actual number of active users (and not necessarily for the number set as the limit).
