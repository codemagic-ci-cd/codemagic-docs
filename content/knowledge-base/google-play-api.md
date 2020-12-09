---
title: Google Play API access
description: How to set up a Google Play service account for Codemagic
weight: 5
---

In order to allow Codemagic to publish applications to Google Play, it is first necessary to set up the proper Google Play API access. 

## Setting up your Google Play service account for Codemagic

### Setting up the service account on Google Play and Google Cloud Platform

To get started, open up Google Play and navigate to API access under settings and click on 'Create new service account'
![Google play start](../uploads/google_play_start.png)

This will lead you to the Google Cloud Platform, where you can get started in creating your service account
![Google cloud platform](../uploads/google_cloud_start.png)

Give the service account 'Editor' access
![Google cloud editor](../uploads/google_cloud_two.png)

Once the service account has been created, click on 'Create key'
![Google cloud key](../uploads/google_cloud_three.png)

Make sure that the key type is set to JSON and click 'Create'
![Google cloud json](../uploads/google_cloud_four.png)

Navigate back to Google Play API access and grant the service account access
![Google play grant](../uploads/google_play_two.png)

If you wish to grant the service account access to all of your applications, just click 'Invite user'
![Google play all](../uploads/google_play_three.png)

If you wish to grant the service account access to a single app or group of apps, then click on 'App permissions' and add the apps that you wish to grant access for
![Google play selected](../uploads/google_play_four.png)

Leave all the default options and click 'Apply'
![Google play apply](../uploads/google_play_five.png)

Once that has been done, click 'Invite user' to finish setting up the service account on Google Play
![Google play finish](../uploads/google_play_finish.png)

### Using the service account with YAML

Navigate to your app in the Codemagic UI and select 'Encrypt environment variables'
![Service account encrypt yaml](../uploads/google_play_yaml_one.png)

Upload or drop in your JSON key file and copy the encrypted variable
![Service account encrypt copy](../uploads/google_play_yaml_two.png)

Add the encrypted variable to your YAML under google_play publishing and commit the changes
![Service account yaml](../uploads/google_play_yaml_three.png)

### Using the service account with Flutter UI projects

Navigate to your app in the Codemagic UI and upload your JSON and save changes
![Service account UI](../uploads/google_play_ui.png)
