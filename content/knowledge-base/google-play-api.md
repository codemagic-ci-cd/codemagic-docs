---
title: Configuring Google Play API access
description: How to set up a Google Play service account for Codemagic
weight: 5
---

In order to allow Codemagic publish applications to Google Play, it is necessary to set up access using Google Play API. 

## Setting up the service account on Google Play and Google Cloud Platform

1. In Google Play Console, navigate to **Settings > API access** and click **Create new service account**.<br><br>
![Google play start](../uploads/google_play_start.png)

2. This will lead you to the Google Cloud Platform where you can start creating your service account by clicking **+ Create service account** at the top of the page.<br><br>
![Google cloud platform](../uploads/google_cloud_start.png)

3. In step 1, fill in the **Service account details** and click **Create**. The name of the service account will allow you to identify it among other service accounts you may have created.

4. In step 2, click the **Select a role** dropdown menu and choose **Basic > Editor** as the role.<br><br>
![Google cloud editor](../uploads/google_cloud_two.png)

5. In step 3, you can leave the fields blank and click **Done**.

6. In the list of created service accounts, identify the account you have just created and click on the menu in the **Actions** column, then click **Manage keys**.<br><br>
![Google cloud key](../uploads/google_cloud_three.png)

7. In the Keys section, click **Add Key > Create new key**. Make sure that the key type is set to `JSON` and click **Create**. Save the key file in a secure location to have it available.<br><br>
![Google cloud json](../uploads/google_cloud_four.png)

8. Navigate back to **Google Play Console > Settings > API access** and click **Grant access** next to the created account.<br><br>
![Google play grant](../uploads/google_play_two.png)

9. On the **App permissions** tab, add the applications you wish to grant access to.<br><br>
![Google play selected](../uploads/google_play_four.png)

10. Go with the default settings for app permissions and click **Apply** (Financial data permissions can be left blank).<br><br> 
![Google play apply](../uploads/google_play_five.png)

11. On the **Account permissions** tab, leave everything as is (there is no need to grant the service account **Admin** access).<br><br>
![Google play all](../uploads/google_play_three.png)

12. Finally, click **Invite user** to finish setting up the service account on Google Play.

## Using the service account with codemagic.yaml

In order to set up publishing to Google Play, you need to encrypt the contents of the service account `JSON` key file and add the encrypted value to the Codemagic configuration file.

1. Navigate to your app settings in the Codemagic UI and click **Encrypt environment variables** at the bottom of the screen.<br><br>
![Service account encrypt yaml](../uploads/google_play_yaml_one.png)

2. Upload or drop the `JSON` key file to the encryption interface and copy the encrypted value.
![Service account encrypt copy](../uploads/google_play_yaml_two.png)

3. In your configuration file, set the encrypted value to the `credentials` variable under `google_play` publishing and commit the changes.
```yaml
workflows:
    publish-workflow:
        name: Publish to Google Play
        ...
        publishing:
            google_play:
                credentials: Encrypted(...)
                track: alpha # specify the Google Play destination track
```


## Using the service account with Flutter UI projects

When configuring Flutter projects through the UI, the service account `JSON` key file must be uploaded to Codemagic in Google Play publishing settings. Follow the instructions [here](../publishing/publishing-to-google-play).
