# Play Store Readiness Checklist

## Android App Bundle

Use the production EAS profile to generate the `.aab` file for Play Store upload:

```bash
eas build --platform android --profile production
```

The production profile is configured in `eas.json` with `android.buildType` set to `app-bundle`.

## Android Permissions

Android permissions are declared through Expo config in `app.json`. During EAS/prebuild, Expo writes these into the generated Android manifest:

- `INTERNET`
- `CAMERA`
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

## Backend Environment

Do not ship a mobile build with localhost API URLs. Configure the production API URL with:

```bash
EXPO_PUBLIC_API_BASE_URL=https://api.your-production-domain.com/api
```

For local Android emulator testing, use a reachable machine address such as:

```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api
```

For Expo Go on a physical device, use your computer's LAN IP address instead of `localhost`.

## Structure

- `frontend-web`: Trainer/Admin portal
- `frontend-mobile`: User app
- `backend-core`: Spring Boot auth and business logic
- `backend-realtime`: Node.js Socket.IO live features
