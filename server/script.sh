#!/bin/bash
npx create-expo-app my-app --yes --no-install
cp App.js my-app/
cp eas.json my-app/
cp app.json my-app/
cd my-app
npx eas-cli build --profile preview --platform android --non-interactive
exit