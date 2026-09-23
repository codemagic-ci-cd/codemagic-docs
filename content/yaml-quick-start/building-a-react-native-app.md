workflows:

  react-native-android:

    name: React Native Android

    max_build_duration: 120

    instance_type: mac_mini_m2

    environment:

      android_signing:

        - keystore_reference

      groups:

        - google_play

      vars:

        PACKAGE_NAME: "io.codemagic.sample.reactnative"

    scripts:

      - name: Set Android SDK location

        script: | 

          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"

      - name: Install npm dependencies

        script: | 

          npm install

      - name: Run Expo Prebuild

        script: | 

          npx expo prebuild

      - name: Set up app/build.gradle

        script: | 

          mv ./support-files/build.gradle android/app

      - name: Build Android release

        script: | 

          LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME")

          if [ -z $LATEST_GOOGLE_PLAY_BUILD_NUMBER ]; then

              # fallback in case no build number was found from google play. Alternatively, you can `exit 1` to fail the build

              UPDATED_BUILD_NUMBER=$BUILD_NUMBER

          else

              UPDATED_BUILD_NUMBER=$(($LATEST_GOOGLE_PLAY_BUILD_NUMBER + 1))

          fi

          cd android

          ./gradlew bundleRelease \

            -PversionCode=$UPDATED_BUILD_NUMBER \

            -PversionName=1.0.$UPDATED_BUILD_NUMBER

    artifacts:

      - android/app/build/outputs/**/*.aab

    publishing:

      email:

        recipients:

          - user_1@example.com

          - user_2@example.com

        notify:

          success: true

          failure: false

      google_play:

        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS

        track: internal

        submit_as_draft: true





  react-native-ios:

    name: React Native iOS

    max_build_duration: 120

    instance_type: mac_mini_m2

    integrations:

      app_store_connect: codemagic

    environment:

      ios_signing:

        distribution_type: app_store

        bundle_identifier: io.codemagic.sample.reactnative

      vars:

        BUNDLE_ID: "io.codemagic.sample.reactnative"

        XCODE_WORKSPACE: "CodemagicSample.xcworkspace" # <-- Put the name of your Xcode workspace here

        XCODE_SCHEME: "CodemagicSample" # <-- Put the name of your Xcode scheme here

        APP_STORE_APPLE_ID: 1555555551

    scripts:

      - name: Install npm dependencies

        script: | 

          npm install

      - name: Run Expo Prebuild

        script: | 

          npx expo prebuild

      - name: Set Info.plist values

        script: | 

          PLIST=$CM_BUILD_DIR/$XCODE_SCHEME/Info.plist

          PLIST_BUDDY=/usr/libexec/PlistBuddy

          $PLIST_BUDDY -c "Add :ITSAppUsesNonExemptEncryption bool false" $PLIST

      - name: Install CocoaPods dependencies

        script: | 

          cd ios && pod install

      - name: Set up provisioning profiles settings on Xcode project

        script: xcode-project use-profiles

      - name: Increment build number

        script: | 

          cd $CM_BUILD_DIR/ios

          LATEST_BUILD_NUMBER=$(app-store-connect get-latest-app-store-build-number "$APP_STORE_APPLE_ID")

          agvtool new-version -all $(($LATEST_BUILD_NUMBER + 1))

      - name: Build ipa for distribution

        script: | 

          xcode-project build-ipa \

            --workspace "$CM_BUILD_DIR/ios/$XCODE_WORKSPACE" \

            --scheme "$XCODE_SCHEME"

    artifacts:

      - build/ios/ipa/*.ipa

      - /tmp/xcodebuild_logs/*.log

      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.app

      - $HOME/Library/Developer/Xcode/DerivedData/**/Build/**/*.dSYM

    publishing:

      email:

        recipients:

          - user_1@example.com

          - user_2@example.com

        notify:

          success: true

          failure: false

      app_store_connect:

        auth: integration



        # Configuration related to TestFlight (optional)

        # Note: This action is performed during post-processing.

        submit_to_testflight: true

        beta_groups: # Specify the names of beta tester groups that will get access to the build once it has passed beta review.

          - group name 1

          - group name 2



        # Configuration related to App Store (optional)

        # Note: This action is performed during post-processing.

        submit_to_app_store: false
