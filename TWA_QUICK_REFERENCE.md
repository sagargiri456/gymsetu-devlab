# TWA Quick Reference Guide

## What is TWA?
**Trusted Web Activity** - Package your PWA as an Android app for Play Store

## Key Differences

| Feature | PWA | TWA | Native App |
|---------|-----|-----|------------|
| Play Store | ❌ | ✅ | ✅ |
| Development | Web | Web | Java/Kotlin |
| Codebase | One | One | Separate |
| Performance | Good | Good | Best |
| Android Features | Limited | Good | Full |

## Prerequisites Checklist

- [ ] Working PWA with HTTPS
- [ ] Domain name
- [ ] Google account
- [ ] $25 for Play Console
- [ ] Android Studio installed
- [ ] Java JDK installed

## Quick Start (5 Steps)

### 1. Install Tools
```bash
npm install -g @bubblewrap/cli
```

### 2. Create TWA
```bash
bubblewrap init
# Follow prompts
```

### 3. Set Up Digital Asset Links
- Create `.well-known/assetlinks.json` on your website
- Add SHA-256 fingerprint
- Verify it's accessible

### 4. Build App
```bash
bubblewrap build --release
```

### 5. Upload to Play Store
- Create Play Console account ($25)
- Upload AAB file
- Complete store listing
- Submit for review

## Digital Asset Links Setup

**File Location:** `https://yourdomain.com/.well-known/assetlinks.json`

**File Content:**
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.gymsetu.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_HERE"]
  }
}]
```

**Verify:**
- Visit URL in browser (should see JSON)
- Use Google's validator tool
- Test in TWA app

## Build Commands

### Debug Build
```bash
bubblewrap build
# or
./gradlew assembleDebug
```

### Release Build
```bash
bubblewrap build --release
# or
./gradlew bundleRelease
```

### Output Locations
- Debug APK: `app/build/outputs/apk/debug/`
- Release AAB: `app/build/outputs/bundle/release/`

## Play Store Requirements

### Required Assets
- ✅ App Icon (512x512 PNG)
- ✅ Feature Graphic (1024x500 PNG)
- ✅ Screenshots (2-8, phone)
- ✅ App Name (30 chars max)
- ✅ Short Description (80 chars max)
- ✅ Full Description (4000 chars max)
- ✅ Privacy Policy URL

### Required Information
- ✅ Content Rating
- ✅ Target Audience
- ✅ Data Safety
- ✅ Contact Information

## Common Issues & Quick Fixes

### Issue: Browser UI Appears
**Fix:** Digital Asset Links not set up correctly
- Check assetlinks.json is accessible
- Verify SHA-256 fingerprint
- Wait 24 hours for propagation

### Issue: App Crashes
**Fix:** Check logs
```bash
adb logcat
```

### Issue: Build Fails
**Fix:** 
- Update Android SDK
- Sync Gradle
- Clean and rebuild

### Issue: Play Store Rejection
**Fix:**
- Read rejection reason
- Fix all issues
- Update and resubmit

## File Structure

```
twa-project/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       └── res/
│   │           └── mipmap-xxxhdpi/
│   │               └── ic_launcher.png
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## Important Files

### AndroidManifest.xml
- Package name
- App name
- Launch URL
- Permissions

### build.gradle
- Dependencies
- Signing config
- Version info

### assetlinks.json (on website)
- Package name
- SHA-256 fingerprint
- Domain verification

## Testing Checklist

- [ ] App opens without browser UI
- [ ] All features work
- [ ] Offline mode works
- [ ] Push notifications work
- [ ] App appears in app drawer
- [ ] Icon displays correctly
- [ ] No crashes
- [ ] Fast loading

## Publishing Checklist

- [ ] TWA built and tested
- [ ] Digital Asset Links verified
- [ ] Signing key generated and backed up
- [ ] AAB file built
- [ ] Play Console account created
- [ ] Store listing complete
- [ ] Screenshots added
- [ ] Privacy policy added
- [ ] Content rating complete
- [ ] App submitted for review

## Key Commands Reference

```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA
bubblewrap init

# Update TWA
bubblewrap update

# Build debug
bubblewrap build

# Build release
bubblewrap build --release

# Generate fingerprint
keytool -list -v -keystore path/to/keystore

# Install on device
adb install app-debug.apk

# View logs
adb logcat
```

## Important URLs

- **Play Console**: https://play.google.com/console
- **Bubblewrap**: https://github.com/GoogleChromeLabs/bubblewrap
- **Asset Links Validator**: https://digitalassetlinks.googleapis.com/v1/statements:list
- **PWA Builder**: https://www.pwabuilder.com/

## Timeline Estimate

- **Setup**: 2-4 hours
- **Development**: 1-2 days
- **Testing**: 1-2 days
- **Store Listing**: 2-4 hours
- **Review**: 1-7 days
- **Total**: ~1-2 weeks

## Cost Breakdown

- **Play Console**: $25 (one-time)
- **Development**: Free (if doing yourself)
- **Domain**: ~$10-15/year (if needed)
- **Hosting**: Varies
- **Total First Year**: ~$35-50

## Pro Tips

1. **Test Early**: Test TWA before finalizing
2. **Backup Key**: Store signing key securely
3. **Verify Links**: Always verify Digital Asset Links
4. **Quality Assets**: Use high-quality screenshots
5. **Respond Reviews**: Engage with users
6. **Regular Updates**: Keep app current
7. **Monitor Analytics**: Track performance
8. **Follow Guidelines**: Read Play Store policies

## Common Mistakes

❌ **Skipping Digital Asset Links**
✅ Always set up assetlinks.json

❌ **Losing Signing Key**
✅ Backup key multiple times

❌ **Incomplete Listing**
✅ Fill all required fields

❌ **Not Testing**
✅ Test on multiple devices

❌ **Ignoring Reviews**
✅ Respond to all feedback

## Next Steps After Publishing

1. Monitor reviews and ratings
2. Track install statistics
3. Respond to user feedback
4. Plan regular updates
5. Promote your app
6. Analyze performance
7. Iterate based on data

---

**For detailed instructions, see: `TWA_AND_PLAY_STORE_GUIDE.md`**

