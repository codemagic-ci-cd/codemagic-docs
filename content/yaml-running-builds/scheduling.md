---
title: Scheduling builds with codemagic.yaml
linkTitle: Scheduling builds
description: Create schedules to run builds at regular intervals
weight: 1
startLineBreak: true
aliases: 
  - /building/scheduling
  - /configuration/scheduling
---

You can schedule Codemagic to automatically build your app on certain days and times. This way, your QA can start the day with the latest version of the app, or you can configure a workflow to run the long test suits at a convenient time and only run fast tests with builds triggered by commits to the repo.

## Setting up scheduled builds

1. Open your application in Codemagic.
2. Switch to the **Scheduled builds** tab and click the **Add new schedule** button.
3. Select the **Branch** and the **Workflow** to run.
4. In the **Schedule for** field, select the days you want to run the build. 
5. Specify the start time (UTC) of the build by selecting a value from the **At** field. Note that the build may be delayed up to 15 minutes during peak hours.
6. Click **Add schedule** to save the schedule.

Saved schedules for each app are displayed in the **Scheduled builds** section on the right sidebar in app settings. If you no longer need the schedule, you can delete it by hovering on the schedule and clicking the trash bin icon.

Builds that are triggered from a schedule are marked with "Schedule" as the trigger in the build overview page.