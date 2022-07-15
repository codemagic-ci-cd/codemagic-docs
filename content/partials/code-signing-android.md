---
---

#### Generating a keystore
You can create a keystore for signing your release builds with the Java Keytool utility by running the following command:

{{< highlight Shell "style=rrt">}}
keytool -genkey -v -keystore codemagic.keystore -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias codemagic
{{< /highlight >}}

Keytool then prompts you to enter your personal details for creating the certificate, as well as provide passwords for the keystore and the key. It then generates the keystore as a file called **codemagic.keystore** in the directory you're in. The key is valid for 10,000 days.


{{<notebox>}}
**Warning:** Keep the keystore and the key.properties files private; do not check them into public source control.
{{</notebox>}}

#### Signing Android apps using Gradle
Modify your **`android/app/build.gradle`** as follows:
{{< highlight kotlin "style=paraiso-dark">}}
...
  android {
      ...
      defaultConfig { ... }
      signingConfigs {
          release {
              if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                  storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                  storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                  keyAlias System.getenv()["CM_KEY_ALIAS"]
                  keyPassword System.getenv()["CM_KEY_PASSWORD"]
              } else {
                  keyAlias keystoreProperties['keyAlias']
                  keyPassword keystoreProperties['keyPassword']
                  storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                  storePassword keystoreProperties['storePassword']
              }
          }
      }
      buildTypes {
          release {
              ...
              signingConfig signingConfigs.release
          }
      }
  }
  ...
{{< /highlight >}}


#### Configuring Environment variables

The environment variables referenced by the `build.gradle` need to be stored in the Codemagic UI. A detailed explanation on how Environment variables and groups work can be found [here](../variables/environment-variable-groups).

The keystore file, like all binary files, has to be base64 encoded before storing its value.

{{< tabpane >}}

{{< tab header="Linux" >}}
{{<markdown>}}
For Linux machines, we recommend installing xclip:

{{< highlight Shell "style=rrt">}}
sudo apt-get install xclip
cat codemagic.keystore | base64 | xclip -selection clipboard
{{< /highlight >}}

Alternatively, you can run the following command and carefuly copy/paste the output:
{{< highlight Shell "style=rrt">}}
openssl base64 -in codemagic.keystore
{{< /highlight >}}
{{</markdown>}}

{{<notebox>}}
**Tip**: When copying file contents always include any tags. e.g. Don't forget to copy `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` too.
{{</notebox>}}
{{< /tab >}}

{{< tab header="macOS" >}}
{{<markdown>}}
On macOS, running the following command base64 encodes the file and copies the result to the clipboard:
{{< highlight Shell "style=rrt">}}
cat codemagic.keystore | base64 | pbcopy
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< tab header="Windows" >}}
{{<markdown>}}
For Windows, the PowerShell command to base64 encode a file and copy it to the clipboard is:
{{< highlight powershell "style=rrt">}}
[Convert]::ToBase64String([IO.File]::ReadAllBytes("codemagic.keystore")) | Set-Clipboard
{{< /highlight >}}
{{</markdown>}}
{{< /tab >}}

{{< /tabpane >}}


1. Open your Codemagic app settings, go to **Environment variables** tab.
2. Enter `CM_KEYSTORE` as the **_Variable name_**.
3. Paste the base64 encoded value of the keystore file in the **_Variable value_** field.
4. Enter a variable group name, e.g. **_keystore_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected so that the variable can be protected by encryption.
6. Click the **Add** button to add the variable.
7. Continue by adding `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS` and `CM_KEY_PASSWORD`
8. Add the `CM_KEYSTORE_PATH` variable with the value `CM_KEYSTORE_PATH = $CM_BUILD_DIR/codemagic.keystore`


{{<notebox>}}
**Tip:** Store all the keystore variables in the same group so they can be imported to codemagic.yaml workflow at once. 
  
If the group of variables is reusable for various applications, they can be defined in [Global variables and secrets](../variables/environment-variable-groups/#global-variables-and-secrets) in **Team settings** for easier access.
{{</notebox>}}

Environment variables have to be added to the workflow either individually or as a group. Modify your `codemagic.yaml` file by adding the following:
{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    name: React Native Android
    # ....
    environment:
        groups:
            - keystore_credentials
{{< /highlight >}}

Environment variables added with the **Secure** option checked are tranferred to the build machine encrypted and are available only while the build is running. The build machine is destroyed at the end.

The content of the `base64` encoded files needs to be decoded before it can be used. Add the following script to your `codemagic.yaml` **scripts** section:

{{< highlight yaml "style=paraiso-dark">}}
workflows:
  react-native-android:
    # ....
    environment:
        # ....
    scripts:
      - name: Set up keystore
        script: |
     echo $CM_KEYSTORE | base64 --decode > $CM_KEYSTORE_PATH
{{< /highlight >}}
