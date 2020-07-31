---
title: Teams
weight: 1
---

If more than one developer is contributing to a project, it is wiser to set up a team so that everyone could work on the project together. Teams of two are free of charge. It is possible to invite more members by purchasing additional seats. Billing information is available [here](https://codemagic.io/pricing/).

{{<notebox>}}Note that teams who enabled billing before June 6th, 2020, still operate under the previous billing system.{{</notebox>}}


## Creating a new team

To create a new team, go to the [app settings](`https://codemagic.io/apps`) and click on the **Teams** icon. Here, click **Create new team**. Choose a suitable name for your team, add the app(s) you want to share by ticking relevant boxes and then click **Create team**. If you don't have any apps to share at this point, you can just add them later.

## Team settings

On the team settings page, you can change your team's name, add or remove shared applications, add or remove users, change user roles, enable/disable billing, leave the team or delete it.

All members in a team will be able to configure app settings, start and view builds. However, team owners have some additional rights. Only team owners can change the team's name, add or remove shared applications and/or integrations, add or remove members or change their roles, or delete teams. Regular members can still see other members, shared applications and integrations, they just cannot change them in any way.

{{<notebox>}}Each team must always have at least one team owner. This means that the only existing team owner cannot downgrade their role before upgrading someone else's.{{</notebox>}}

### Changing the team name

To change the name of the team, go to the team settings page and click on the name of the team. You will now be able to type in this field and can change the name as you see fit. After you are done with the changes, click **Save changes**. This can only be done by the team owner.

### Adding/Removing shared applications

To add or remove shared applications, click on **Shared applications** to see the list of available applications. Now just tick the boxes for applications you wish to share with your team — or untick the ones you don't wish to share anymore. After adding or removing any applications, click **Save changes**. This can only be done by the team owner.

### Adding/Removing team members

You can add one additional user for free by clicking on **Invite team member**. If you need to add more users, enable billing (by clicking **Enable billing to add more members**) and you can add additional members to the team. This can only be done by the team owner.

To remove any team members, click on the three dots next to their name and then click **Remove user**.

### Managing team integrations

By default, team creator's login data is used to access repository information. If you want to change it, click on **Team integrations** to open the full view of available integrations and connect the suitable ones by clicking **Connect**. Here, you can also see the Codemagic API token by clicking **Show** (you can hide it again by clicking **Hide**).

### Leaving the team

A team member can leave the team at any time by clicking **Leave team** in the lower part of the page. If the only team owner wants to leave the team, they first have to upgrade another member to the owner.

### Deleting the team

Only the team owner can delete teams. To do so, go to the lower part of the page (under **Danger zone**) and click **Delete team**.

{{<notebox>}}Note that teams can only be deleted if there aren't any shared applications. In case of existing shared applications, they have to be removed befored deleting the team.{{</notebox>}}
