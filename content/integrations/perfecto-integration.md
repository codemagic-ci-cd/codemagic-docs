---
title: Perfecto integration
description: How to integrate your workflows with Perfecto using codemagic.yaml
weight: 13
---

**Perfecto** is a cloud-based test automation platform for web and mobile that allows application developers and QA engineers to create and execute tests across devices and browsers at scale. Being a market leader in its area, Perfecto offers many ways to integrate with different stages of the software development and testing lifecycle. It is possible to integrate with Perfecto directly from your **codemagic.yaml**

A sample project that shows how to configure Perfecto integration for real device testing is available in our [Sample projects repository](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/perfecto_sample_project).

A sample project showcasing Perfecto **App Automate** integration for Flutter apps is available [here](https://github.com/codemagic-ci-cd/codemagic-sample-projects/tree/main/integrations/perfecto_flutter_sample_project).


## Configuring Perfecto access

Signing up with [Perfecto](https://www.perfecto.io/) is required in order to get credentials that are needed during an upload process. 

1. Get the Perfecto access token from the Perfecto UI.
1. Open your Codemagic app settings, and go to the **Environment variables** tab.
2. Enter the desired **_Variable name_**, e.g. `PERFECTO_TOKEN`.
3. Copy and paste the Perfecto token string as **_Variable value_**.
4. Enter the variable group name, e.g. **_perfecto_credentials_**. Click the button to create the group.
5. Make sure the **Secure** option is selected.
6. Click the **Add** button to add the variable.

7. Add the variable group to your `codemagic.yaml` file
{{< highlight yaml "style=paraiso-dark">}}
  environment:
    groups:
      - perfecto_credentials
{{< /highlight >}}


## Uploading to Perfecto

Using the following cURL script in a post-build script, **Release APK** and **Release IPA** binaries can be uploaded to the Perfecto platform:

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload to Perfecto
      script: | 
        curl "https://web.app.perfectomobile.com/repository/api/v1/artifacts" \
        -H "Perfecto-Authorization: $PERFECTO_TOKEN" \
        -H "Content-Type: multipart/form-data" \
        -F "requestPart={\"artifactLocator\":\"PRIVATE:app.aab\",\"artifactType\":\"ANDROID\",\"override\":true}" \
        -F "inputStream=@/path/to/your_binary"
{{< /highlight >}}



## Test Automation

The uploaded files can be directly used to start your automation testing. To do this, desired capabilities can be set inside your custom-made test scripts in your project. For example, if your application requires device sensors such as camera or fingerprint reader, then **sensorInstrument** needs to be set:

{{< highlight dart "style=paraiso-dark">}}
  capabilities.setCapability("sensorInstrument", true);
{{< /highlight >}}

## Flutter apps integration

{{< tabpane >}}
{{< tab header="Android" >}}
{{<markdown>}}
In order to set up integration for Flutter specific apps the following steps must be followed:

1. Generate a folder named **PerfectoRunAndroid** (can be named differently) in the root directory of your project.

2. Change dir to **PerfectoRunAndroid** directory and initiate Gradle by executing the following commands in your local terminal:
{{< highlight bash "style=paraiso-dark">}}
cd PerfectoRun 
gradle init 
./gradlew wrapper
{{< /highlight >}}

3. Running the above commands will create the necessary gradle files along with an empty `build.gradle`. Edit the `build.gradle` by adding the following:

{{< highlight Groovy "style=paraiso-dark">}}
buildscript {
    repositories {
        maven {
            url "https://repo1.perfectomobile.com/public/repositories/maven/"      
        }
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.perfectomobile.instrumentedtest.gradleplugin:plugin:+"
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
// Apply the plugin 
apply plugin: 'com.perfectomobile.instrumentedtest.gradleplugin'
perfectoGradleSettings {
    configFileLocation "ConfigFile.json"
}
    task clean(type: Delete) {
        delete rootProject.buildDir
}
{{< /highlight >}}


4. Create a file called `ConfigFile.json` and add the following Json content in there:

{{< highlight json "style=paraiso-dark">}}
{
      "cloudURL": "web-fra.perfectomobile.com",
      "securityToken": "xxxxxxxxxxxx",
      "devices": [
            {
              "platformName" : "Android",
              "platformVersion": "^12.*”,
              “description”:”free”
            },
            {
              "platformName_" : "Android",
              "platformVersion_": "^11.*”,
              “description”:”free”
            }
      ],
      "jobName": "some_job",
      "jobNumber": 1,
      "branch": "some_branch",
      "projectName": "My_Flutter_project",
      "projectVersion": "v1.0",
      "tags": [
        "espresso", "plugin"  ],
      "apkPath": "YOUR_APK_PATH",
      "testApkPath": "YOUR_TEST_APK_PATH",
      "installationDetails" : {"preCleanUp" : "true"},
      "postExecution" : {"uninstall" : "false" },
      "debug": false,
      "failBuildOnFailure": false,
      "takeScreenshotOnTestFailure": true,
      "shard": false,
      "testTimeout" : 60000
    }
{{< /highlight >}}

**"securityToken"** contains your Perfecto Token that can be fetched from your Perfecto account.

5. Modify your `codemagic.yaml` file to include post-build scripts to generate **testBuildType** and upload the files to Perfecto

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Build Android Test release
      script: | 
        ./gradlew assembleAndroidTest
    - name: Upload files to Perfecto and run tests
      script: | 
        cd PerfectoRunAndroid
        ./gradlew perfecto-android-inst
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}



{{< tab header="iOS" >}}
{{<markdown>}}

In order to set up integration for Flutter specific apps the following steps must be followed:

1. Create another folder in the root directory named **PerfectoRunIos** (can be named differently)

2. Manually create `build.gradle` file with the following content:

{{< highlight Groovy "style=paraiso-dark">}}
buildscript {
    repositories {
        maven {
            url "https://repo1.perfectomobile.com/public/repositories/maven"
        }
    }
    dependencies {
        classpath "com.perfectomobile.instrumentedtest.gradleplugin:plugin:+"    
    }
}
apply plugin: 'com.perfectomobile.instrumentedtest.gradleplugin'
perfectoGradleSettings {
    configFileLocation "configFile.json"
}
{{< /highlight >}}


3. Create a file called `ConfigFile.json` and add the following Json content in there:
{{< highlight json "style=paraiso-dark">}}
{
    "cloudURL": "beta.perfectomobile.com",
    "securityToken":"xxxxxxxxxxxx",
	"appPath":"repository:PATH_TO_IPA",
	"hostedTestModuleName":"RunnerTests",
	"isHostedTestModule":true,
	"devices": [
			{"deviceName":"00008020-000D2CC42ED8002E"},
			{"deviceName":"00008101-000B05283081401E"}
	],
	"shard": false,
	"jobName": "Flutter_iOS_Job",
  	"jobNumber": 1,
  	"branch": "Flutter_Branch",
  	"projectName": "My_Flutter_iOS_Project",
  	"projectVersion": "v1.0",
  	"tags": [
    "XCUI", "plugin"  ],
	"takeScreenshotOnTestFailure": false,
	"takeScreenshotOnTestEnd": false,
	"takeScreenshotOnTestStep": false,
	"runUITests":true,
	"runUnitTests":false,
	"installationDetails": {
		"resign": true
	  },  
  	"numOfDevices": 2
  }
{{< /highlight >}}

4.  Modify your `codemagic.yaml` file to include a script upload the files to Perfecto

{{< highlight yaml "style=paraiso-dark">}}
  scripts:
    - name: Upload iOS files to Perfecto and run tests
      script: | 
        cd PerfectoRunIos
        gradle perfecto-xctest
{{< /highlight >}}

{{</markdown>}}
{{< /tab >}}
{{< /tabpane >}}

## Get Help and Support with Perfecto
	
To test how Perfecto supports Flutter Integration Testing for native mobile applications, [visit their website](https://www.perfecto.io/integrations/flutter) and get access to a [free trial](https://www.perfecto.io/free-trial). Additionally, for video demonstrations and some more information on how to set up Flutter for iOS and Android apps in Perfecto, visit the following documentation pages:
	 1. [Setting up Flutter for iOS in Perfecto](https://help.perfecto.io/perfecto-help/content/perfecto/automation-testing/flutter-ios.htm)
	 2. [Setting up Flutter Android in Perfecto](https://help.perfecto.io/perfecto-help/content/perfecto/automation-testing/flutter-android.htm)

