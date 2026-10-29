# Run locally

The best way to run the project in development depends on whether you are developing for the web browser or the Electron desktop app:

### 1. Web Browser (Recommended)

Run the Vite development server:

```zsh
npm run dev
```

- Automatically generates protobuf contracts (`buf generate`) and starts Vite on `http://localhost:5173`.
- **Browser Requirement:** Use a Chromium-based browser (Google Chrome, Microsoft Edge, Brave) to ensure Web Serial and Web Bluetooth device APIs are functional.

---

### 2. Electron Desktop App

If you are testing the native desktop shell:

1. **Start the Vite dev server** (Terminal 1):
   ```zsh
   npm run dev
   ```
2. **Compile and launch Electron** (Terminal 2):
   ```zsh
   npm run build:electron && npx electron .
   ```

- Electron will load `http://localhost:5173` with DevTools enabled and native USB/Bluetooth device selectors active.
