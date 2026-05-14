# Zeus App Security Specification

## 1. Data Invariants
- A **Page** must always have a `title` and reflect the current `ownerId` matching the authenticated user.
- A **User** profile can only be modified by the matching `uid`.
- **subscriptionStatus** and **trialStartDate** are immutable once set by the server (simulated via rules).
- **AIConversation** is private to the user.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Creating a Page with `ownerId: "someone_else"`.
2. **Profile Interception**: Authenticated User A attempting to `get()` User B's profile.
3. **Ghost Metadata**: Attempting to set `isPremium: true` in a `users` document update.
4. **Id Poisoning**: Using a 2KB string as a `pageId`.
5. **Type Confusion**: Sending `isFavorite: "yes"` (string) instead of `true` (bool).
6. **Relational Leak**: Attempting to read `pages` without being signed in.
7. **Blanket Read Request**: `db.collection('pages').get()` (should require specific ownerId filter).
8. **PII Exposure**: User A reading User B's list of favorite addresses.
9. **State Jump**: Updating `subscriptionStatus` directly via client SDK.
10. **Timestamp Manipulation**: Sending a `createdAt` from 1999 instead of `request.time`.
11. **Orphaned Write**: Creating a Page with a non-existent `authorId`.
12. **Content Bloat**: Sending a 2MB string for the `content` field.

## 3. Test Runner (Draft)
```typescript
// All payloads above must return PERMISSION_DENIED
```
